import isEmpty from 'lodash/isEmpty';
import debounce from 'lodash/debounce';
import Storage from '../services/Storage';
import appFirebase from '../services/appFirebase';
import validations from '../validations';

function generateProjectKey() {
  const date = new Date();
  return (date.getTime() * 1000 + date.getMilliseconds()).toString();
}

function getCurrentProject(state) {
  const projectKey = state.currentProject.get('projectKey');
  if (projectKey) {
    return state.projects.get(projectKey);
  }

  return null;
}

const showErrorsAfterDebounce = debounce((dispatch) => {
  dispatch({type: 'ERROR_DEBOUNCE_FINISHED'});
}, 1000);

function validateSource(dispatch, language, source, enabledLibraries) {
  dispatch({
    type: 'VALIDATING_SOURCE',
    payload: {
      language,
    },
  });

  const validate = validations[language];
  validate(source, enabledLibraries.toJS()).then((errors) => {
    dispatch({
      type: 'VALIDATED_SOURCE',
      payload: {
        language,
        errors,
      },
    });

    if (!isEmpty(errors)) {
      showErrorsAfterDebounce(dispatch);
    }
  });
}

function validateAllSources(dispatch, project) {
  const enabledLibraries = project.get('enabledLibraries');
  project.get('sources').forEach((source, language) => {
    validateSource(dispatch, language, source, enabledLibraries);
  });
}

function createProject() {
  return (dispatch, getState) => {
    dispatch({
      type: 'PROJECT_CREATED',
      payload: {
        projectKey: generateProjectKey(),
      },
    });

    const state = getState();
    const projectKey = state.currentProject.get('projectKey');
    const project = state.projects.get(projectKey);

    Storage.save(project.toJS());
    Storage.setCurrentProjectKey(projectKey);
  };
}

function loadCurrentProjectFromStorage() {
  return (dispatch, getState) => {
    Storage.getCurrentProjectKey().then((projectKey) => {
      if (projectKey) {
        Storage.load(projectKey).then((project) => {
          dispatch({
            type: 'CURRENT_PROJECT_LOADED_FROM_STORAGE',
            payload: {project},
          });

          validateAllSources(dispatch, getCurrentProject(getState()));
        });
      } else {
        createProject()(dispatch, getState);
      }
    });
  };
}

function updateProjectSource(projectKey, language, newValue) {
  return (dispatch, getState) => {
    dispatch({
      type: 'PROJECT_SOURCE_EDITED',
      payload: {
        projectKey,
        language,
        newValue,
      },
    });

    const currentProject = getCurrentProject(getState());
    Storage.save(currentProject.toJS());

    validateSource(
      dispatch,
      language,
      newValue,
      currentProject.get('enabledLibraries')
    );
  };
}

function changeCurrentProject(projectKey) {
  return (dispatch, getState) => {
    dispatch({
      type: 'CURRENT_PROJECT_CHANGED',
      payload: {projectKey},
    });

    Storage.setCurrentProjectKey(projectKey);

    validateAllSources(dispatch, getCurrentProject(getState()));
  };
}

function toggleLibrary(projectKey, libraryKey) {
  return (dispatch, getState) => {
    dispatch({
      type: 'PROJECT_LIBRARY_TOGGLED',
      payload: {
        projectKey,
        libraryKey,
      },
    });

    validateAllSources(dispatch, getCurrentProject(getState()));
  };
}

function loadAllProjects() {
  return (dispatch) => Storage.all().then((projects) => {
    projects.forEach((project) => {
      dispatch({
        type: 'PROJECT_LOADED_FROM_STORAGE',
        payload: {project},
      });
    });
  });
}

function addRuntimeError(error) {
  return {
    type: 'RUNTIME_ERROR_ADDED',
    payload: {error},
  };
}

function clearRuntimeErrors() {
  return {
    type: 'RUNTIME_ERRORS_CLEARED',
  };
}

function listenForAuth() {
  return (dispatch) => {
    appFirebase.onAuth((authData) => {
      dispatch({
        type: 'USER_AUTHENTICATED',
        payload: authData,
      });
    });
  };
}

export {
  createProject,
  changeCurrentProject,
  loadCurrentProjectFromStorage,
  loadAllProjects,
  updateProjectSource,
  toggleLibrary,
  addRuntimeError,
  clearRuntimeErrors,
  listenForAuth,
};
