import {createAction} from 'redux-actions';
import identity from 'lodash/identity';
import FirebasePersistor from '../persistors/FirebasePersistor';
import {loadAllProjects, saveCurrentProject} from '.';
import {createProject, loadCurrentProject} from './projects';

export const userAuthenticated = createAction(
  'USER_AUTHENTICATED',
  identity
);

const resetWorkspace = createAction('RESET_WORKSPACE');

const userLoggedOut = createAction('USER_LOGGED_OUT');

export function logIn(userData) {
  return (dispatch, getState) => {
    dispatch(userAuthenticated({userData}));

    if (!saveCurrentProject(getState())) {
      dispatch(resetWorkspace());
      dispatch(setCurrentProjectAfterLogin(userData.uid));
    }

    dispatch(loadAllProjects());
  };
}

export function logOut() {
  return (dispatch) => {
    dispatch(resetWorkspace());
    dispatch(userLoggedOut());
    dispatch(createProject());
  };
}

function setCurrentProjectAfterLogin(uid) {
  return (dispatch) => {
    const persistor = new FirebasePersistor(uid);
    persistor.loadCurrentProject().then((project) => {
      if (project) {
        dispatch(loadCurrentProject(project));
      } else {
        dispatch(createProject());
      }
    });
  };
}
