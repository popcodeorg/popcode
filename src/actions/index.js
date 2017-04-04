import FirebasePersistor from '../persistors/FirebasePersistor';
import validations from '../validations';
import {isPristineProject} from '../util/projectUtils';
import Analyzer from '../analyzers';

import applicationLoaded from './applicationLoaded';

import {
  exportingGist,
} from './clients';

import {
  createProject,
  changeCurrentProject,
  updateProjectSource,
} from './projects';

import {
  validatedSource,
} from './errors';

import {
  userTyped,
  userRequestedFocusedLine,
  editorFocusedRequestedLine,
  notificationTriggered,
  userDismissedNotification,
} from './ui';

import {
  userAuthenticated,
  userLoggedOut,
} from './user';

function getCurrentPersistor(state) {
  const currentUser = state.get('user');
  if (currentUser.get('authenticated')) {
    return new FirebasePersistor(currentUser.get('id'));
  }
  return null;
}

export function getCurrentProject(state) {
  const projectKey = state.getIn(['currentProject', 'projectKey']);
  if (projectKey) {
    return state.getIn(['projects', projectKey]);
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

function validateSource(language, source, projectAttributes) {
  return async (dispatch, getState) => {
    const validate = validations[language];
    const errors = await validate(source, projectAttributes);
    const currentSource = getCurrentProject(getState()).
      get('sources').get(language);

    if (currentSource !== source) {
      return;
    }

    dispatch(validatedSource(language, errors));
  };
}

export function validateAllSources(project) {
  return (dispatch) => {
    const projectAttributes = new Analyzer(project);
    project.get('sources').forEach((source, language) => {
      dispatch(validateSource(language, source, projectAttributes));
    });
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
  return async (dispatch, getState) => {
    const persistor = getCurrentPersistor(getState());
    if (persistor === null) {
      return;
    }

    const projects = await persistor.all();
    projects.forEach((project) => {
      dispatch({
        type: 'PROJECT_LOADED',
        payload: {project},
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
  userAuthenticated,
  userLoggedOut,
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
  applicationLoaded,
};
