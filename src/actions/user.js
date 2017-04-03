import {createAction} from 'redux-actions';
import identity from 'lodash/identity';

export const userAuthenticated = createAction('USER_AUTHENTICATED', identity);

export const userLoggedOut = createAction('USER_LOGGED_OUT');
