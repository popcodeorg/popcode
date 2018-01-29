import {createAction} from 'redux-actions';

export const logIn = createAction('LOG_IN');

export const logOut = createAction('LOG_OUT');

export const confirmIdentity = createAction('CONFIRM_IDENTITY');

export const rejectIdentity = createAction('REJECT_IDENTITY');

export const userAuthenticated = createAction('USER_AUTHENTICATED');

export const userLoggedOut = createAction('USER_LOGGED_OUT');
