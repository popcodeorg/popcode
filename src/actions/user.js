import {createAction} from 'redux-actions';
import identity from 'lodash-es/identity';

export const logIn = createAction('LOG_IN');

export const logOut = createAction('LOG_OUT');

export const userAuthenticated = createAction('USER_AUTHENTICATED', identity);

export const userLoggedOut = createAction('USER_LOGGED_OUT');
