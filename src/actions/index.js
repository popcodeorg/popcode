import FirebasePersistor from '../persistors/FirebasePersistor';
import validations from '../validations';
import {isPristineProject} from '../util/projectUtils';

import bootstrap from './bootstrap';

import {
  exportingGist,
} from './clients';

import {
  createProject,
  changeCurrentProject,
} from './projects';

import {
  userTyped,
  userRequestedFocusedLine,
  editorFocusedRequestedLine,
  notificationTriggered,
  userDismissedNotification,
} from './ui';

import {
  logIn,
  logOut,
} from './user';

import Analyzer from '../analyzers';

function getCurrentPersistor(state) {
  const currentUser = state.user;
  if (currentUser.get('authenticated')) {
    return new FirebasePersistor(currentUser.get('id'));
  }
  return null;
}

export function getCurrentProject(state) {
  const projectKey = state.currentProject.get('projectKey');
  if (projectKey) {
    return state.projects.get(projectKey);
  }

  return null;
}

export function saveCurrentProject(state) {
  const currentProject = getCurrentProject(state);
  const persistor = getCurrentPersistor(state);

  if (persistor && currentProject && !isPristineProject(currentProject)) {
    persistor.saveCurrentProject(currentProject.toJS());
    return true;
  }

  return false;
}

function validateSource(language, source, analyzer) {
  return (dispatch, getState) => {
    const validate = validations[language];
    validate(source, analyzer).then((errors) => {
      const currentSource = getCurrentProject(getState()).
        get('sources').get(language);

      if (currentSource !== source) {
        return;
      }

      dispatch({
        type: 'VALIDATED_SOURCE',
        payload: {
          language,
          errors,
        },
      });
    });
  };
}

export function validateAllSources(project) {
  return (dispatch) => {
    const analyzer = new Analyzer(project);
    project.get('sources').forEach((source, language) => {
      dispatch(validateSource(language, source, analyzer));
    });
  };
}

function updateProjectSource(projectKey, language, newValue) {
  return (dispatch, getState) => {
    dispatch({
      type: 'PROJECT_SOURCE_EDITED',
      meta: {timestamp: Date.now()},
      payload: {
        projectKey,
        language,
        newValue,
      },
    });

    const state = getState();
    saveCurrentProject(state);

    const currentProject = getCurrentProject(state);
    const analyzer = new Analyzer(currentProject);
    dispatch(validateSource(
      language,
      newValue,
      analyzer
    ));
  };
}

function toggleLibrary(projectKey, libraryKey) {
  return (dispatch, getState) => {
    dispatch({
      type: 'PROJECT_LIBRARY_TOGGLED',
      meta: {timestamp: Date.now()},
      payload: {
        projectKey,
        libraryKey,
      },
    });

    const state = getState();
    dispatch(validateAllSources(getCurrentProject(state)));
    saveCurrentProject(state);
  };
}

export function loadAllProjects() {
  return (dispatch, getState) => {
    const persistor = getCurrentPersistor(getState());
    if (persistor === null) {
      return;
    }

    persistor.all().then((projects) => {
      projects.forEach((project) => {
        dispatch({
          type: 'PROJECT_LOADED',
          payload: {project},
        });
      });
    });
  };
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

function minimizeComponent(componentName) {
  return {
    type: 'COMPONENT_MINIMIZED',
    payload: {componentName},
  };
}

function maximizeComponent(componentName) {
  return {
    type: 'COMPONENT_MAXIMIZED',
    payload: {componentName},
  };
}

function toggleDashboard() {
  return {type: 'DASHBOARD_TOGGLED'};
}

function toggleDashboardSubmenu(submenu) {
  return {type: 'DASHBOARD_SUBMENU_TOGGLED', payload: {submenu}};
}

export {
  createProject,
  changeCurrentProject,
  updateProjectSource,
  toggleLibrary,
  logIn,
  logOut,
  addRuntimeError,
  clearRuntimeErrors,
  minimizeComponent,
  maximizeComponent,
  toggleDashboard,
  toggleDashboardSubmenu,
  userTyped,
  userRequestedFocusedLine,
  editorFocusedRequestedLine,
  notificationTriggered,
  userDismissedNotification,
  exportingGist,
  bootstrap,
};
