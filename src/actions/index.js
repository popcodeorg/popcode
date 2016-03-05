import isEmpty from 'lodash/isEmpty';
import debounce from 'lodash/debounce';
import LocalPersistor from '../persistors/LocalPersistor';
import FirebasePersistor from '../persistors/FirebasePersistor';
import appFirebase from '../services/appFirebase';
import validations from '../validations';

function getCurrentPersistor(state) {
  const currentUser = state.user.toJS();
  if (currentUser.authenticated) {
    return new FirebasePersistor(currentUser);
  }
  return LocalPersistor;
}

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
    const persistor = getCurrentPersistor(state);

    persistor.save(project.toJS());
    persistor.setCurrentProjectKey(projectKey);
  };
}

function loadCurrentProjectFromStorage() {
  return (dispatch, getState) => {
    const persistor = getCurrentPersistor(getState());
    persistor.getCurrentProjectKey().then((projectKey) => {
      if (projectKey) {
        persistor.load(projectKey).then((project) => {
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

    const state = getState();
    const currentProject = getCurrentProject(state);
    getCurrentPersistor(state).save(currentProject.toJS());

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

    const state = getState();
    getCurrentPersistor(state).setCurrentProjectKey(projectKey);

    validateAllSources(dispatch, getCurrentProject(state));
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
  return (dispatch, getState) => getCurrentPersistor(getState()).all().then(
    (projects) => {
      projects.forEach((project) => {
        dispatch({
          type: 'PROJECT_LOADED_FROM_STORAGE',
          payload: {project},
        });
      });
    }
  );
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

function resetWorkspace(dispatch) {
  dispatch({type: 'RESET_WORKSPACE'});
  dispatch(loadCurrentProjectFromStorage());
  dispatch(loadAllProjects());
}

function logIn(dispatch, authData) {
  dispatch({type: 'USER_AUTHENTICATED', payload: authData});
  resetWorkspace(dispatch);
}

function logOut(dispatch) {
  dispatch({type: 'USER_LOGGED_OUT'});
  resetWorkspace(dispatch);
}

function listenForAuth() {
  return (dispatch) => {
    appFirebase.onAuth((authData) => {
      if (authData === null) {
        logOut(dispatch);
      } else {
        logIn(dispatch, authData);
      }
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
