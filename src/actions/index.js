import get from 'lodash/get';
import find from 'lodash/find';
import filter from 'lodash/filter';
import values from 'lodash/values';
import map from 'lodash/map';
import isFunction from 'lodash/isFunction';
import FirebasePersistor from '../persistors/FirebasePersistor';
import Gists from '../services/Gists';
import appFirebase from '../services/appFirebase';
import validations from '../validations';

import {createProject, changeCurrentProject} from './projects';
import {
  userTyped,
  userRequestedFocusedLine,
  editorFocusedRequestedLine,
  notificationTriggered,
  userDismissedNotification,
} from './ui';
import {exportingGist} from './clients';
import {isPristineProject} from '../util/projectUtils';

function generateProjectKey() {
  const date = new Date();
  return (date.getTime() * 1000 + date.getMilliseconds()).toString();
}

function getCurrentPersistor(state) {
  const currentUser = state.user.toJS();
  if (currentUser.authenticated) {
    return new FirebasePersistor(currentUser);
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

function validateSource(language, source, enabledLibraries) {
  return (dispatch, getState) => {
    const validate = validations[language];
    validate(source, enabledLibraries.toJS()).then((errors) => {
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
    const enabledLibraries = project.get('enabledLibraries');
    project.get('sources').forEach((source, language) => {
      dispatch(validateSource(language, source, enabledLibraries));
    });
  };
}

function ensureProject() {
  return (dispatch, getState) => {
    if (getCurrentProject(getState()) === null) {
      dispatch(createProject());
    }
  };
}

function loadCurrentProjectFromStorage() {
  return (dispatch, getState) => {
    const persistor = getCurrentPersistor(getState());
    if (persistor === null) {
      dispatch(createProject());
      return;
    }

    persistor.getCurrentProjectKey().then((projectKey) => {
      if (projectKey) {
        persistor.load(projectKey).then((project) => {
          dispatch({
            type: 'CURRENT_PROJECT_LOADED_FROM_STORAGE',
            payload: {project},
          });

          dispatch(validateAllSources(getCurrentProject(getState())));
        });
      } else {
        dispatch(ensureProject());
      }
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
    dispatch(validateSource(
      language,
      newValue,
      currentProject.get('enabledLibraries')
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

function loadAllProjects() {
  return (dispatch, getState) => {
    const persistor = getCurrentPersistor(getState());
    if (persistor === null) {
      return;
    }

    persistor.all().then((projects) => {
      projects.forEach((project) => {
        dispatch({
          type: 'PROJECT_LOADED_FROM_STORAGE',
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

function resetWorkspace() {
  return {type: 'RESET_WORKSPACE'};
}

function userAuthenticated(authData) {
  return {type: 'USER_AUTHENTICATED', payload: authData};
}

function logIn(authData) {
  return (dispatch, getState) => {
    dispatch(userAuthenticated(authData));

    if (!saveCurrentProject(getState())) {
      dispatch(resetWorkspace());
      dispatch(loadCurrentProjectFromStorage());
    }

    dispatch(loadAllProjects());
  };
}

function userLoggedOut() {
  return {type: 'USER_LOGGED_OUT'};
}

function logOut() {
  return (dispatch) => {
    dispatch(userLoggedOut());
    dispatch(resetWorkspace());
    dispatch(createProject());
  };
}

function initializeCurrentProjectFromGist(gistData) {
  return (dispatch) => {
    const projectKey = generateProjectKey();
    dispatch(importProjectFromGist(projectKey, gistData));
    dispatch(changeCurrentProject(projectKey));
  };
}

function importProjectFromGist(projectKey, gistData) {
  const files = values(gistData.files);
  const popcodeJson = parsePopcodeJson(files);
  const project = {
    projectKey,
    sources: {
      html: get(find(files, {language: 'HTML'}), 'content', ''),
      css: map(filter(files, {language: 'CSS'}), 'content').join('\n\n'),
      javascript: map(filter(files, {language: 'JavaScript'}), 'content').
        join('\n\n'),
    },
    enabledLibraries: popcodeJson.enabledLibraries || [],
    updatedAt: Date.now(),
  };

  return {
    type: 'PROJECT_IMPORTED',
    payload: {project},
  };
}

function parsePopcodeJson(files) {
  const popcodeJsonFile = find(files, {filename: 'popcode.json'});
  if (!popcodeJsonFile) {
    return {};
  }
  return JSON.parse(get(popcodeJsonFile, 'content', '{}'));
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

function bootstrap({gistId} = {gistId: null}) {
  return (dispatch, getState) => {
    const initialAuth = new Promise((resolve) => {
      appFirebase.onAuth((authData) => {
        if (authData === null) {
          dispatch(logOut());
        } else {
          if (isFunction(get(window, 'console.log'))) {
            // eslint-disable-next-line no-console
            console.log('logged in with user ID', authData.uid);
          }
          dispatch(logIn(authData));
        }
        resolve();
      });
    });

    let gistLoaded;
    if (gistId) {
      gistLoaded =
        Gists.loadFromId(gistId, getState().user.toJS()).catch((error) => {
          if (get(error, 'response.status') === 404) {
            dispatch(notificationTriggered('gist-import-not-found'));
            return Promise.resolve();
          }
          return Promise.reject(error);
        });
    } else {
      gistLoaded = Promise.resolve();
    }

    Promise.all([gistLoaded, initialAuth]).then(([gistData]) => {
      if (gistData) {
        dispatch(initializeCurrentProjectFromGist(gistData));
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
  importProjectFromGist,
};
