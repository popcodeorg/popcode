import {createAction} from 'redux-actions';
import identity from 'lodash/identity';
import {loadAllProjects, saveCurrentProject} from '.';
import {createProject} from './projects';

export const userAuthenticated = createAction(
  'USER_AUTHENTICATED',
  identity
);

const resetWorkspace = createAction('RESET_WORKSPACE');

const userLoggedOut = createAction('USER_LOGGED_OUT');

export function logIn(userData) {
  return (dispatch, getState) => {
    dispatch(userAuthenticated({userData}));
    saveCurrentProject(getState());
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
