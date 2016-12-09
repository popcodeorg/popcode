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

export function logIn(authData) {
  return (dispatch, getState) => {
    dispatch(userAuthenticated(authData));

    if (!saveCurrentProject(getState())) {
      dispatch(resetWorkspace());
      dispatch(setCurrentProjectAfterLogin(authData));
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

function setCurrentProjectAfterLogin(authData) {
  return (dispatch) => {
    const persistor = new FirebasePersistor(authData.auth.uid);
    persistor.loadCurrentProject().then((project) => {
      if (project) {
        dispatch(loadCurrentProject(project));
      } else {
        dispatch(createProject());
      }
    });
  };
}
