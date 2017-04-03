import {createAction} from 'redux-actions';
import identity from 'lodash/identity';

export const userAuthenticated = createAction(
  'USER_AUTHENTICATED',
  identity,
);

const resetWorkspace = createAction('RESET_WORKSPACE', identity);

export const userLoggedOut = createAction('USER_LOGGED_OUT');

export function logOut() {
  return (dispatch, getState) => {
    const currentProjectKey =
      getState().getIn(['currentProject', 'projectKey']);
    dispatch(resetWorkspace({currentProjectKey}));
    dispatch(userLoggedOut());
  };
}
