import {Map} from 'immutable';
import find from 'lodash-es/find';
import isUndefined from 'lodash-es/isUndefined';
import reduce from 'lodash-es/reduce';

import {
  AccountMigration,
  User,
  UserAccount,
  UserIdentityProvider,
} from '../records';
import {AccountMigrationState, LoginState} from '../enums';

function getToken(credential) {
  if (credential.providerId === 'github.com') {
    return credential.accessToken;
  } else if (credential.providerId === 'google.com') {
    return credential.idToken;
  }
  return null;
}

function addIdentityProvider(state, userData, credential) {
  const providerData = find(userData.providerData, {
    providerId: credential.providerId,
  });
  if (isUndefined(providerData)) {
    return state;
  }
  return state.setIn(
    ['account', 'identityProviders', credential.providerId],
    new UserIdentityProvider({
      accessToken: getToken(credential),
      avatarUrl: providerData.photoURL,
      displayName: providerData.displayName,
    }),
  );
}

function createUserAccountFromProfileAndCredential(profile, credential) {
  if (credential.providerId !== 'github.com') {
    throw new Error(`Unexpected credential provider ${credential.providerId}`);
  }

  const displayName = profile.name || profile.login;
  const avatarUrl = profile.avatar_url;
  return new UserAccount({
    displayName,
    avatarUrl,
    identityProviders: new Map({
      'github.com': new UserIdentityProvider({
        accessToken: getToken(credential),
        avatarUrl,
        displayName,
      }),
    }),
  });
}

function user(stateIn, action) {
  const state = stateIn || new User();

  switch (action.type) {
    case 'USER_AUTHENTICATED': {
      const {user: userData, credentials} = action.payload;

      return reduce(
        credentials,
        (intermediateState, credential) =>
          addIdentityProvider(intermediateState, userData, credential),
        state.merge({
          loginState: LoginState.AUTHENTICATED,
          account: new UserAccount({
            id: userData.uid,
            displayName: userData.displayName,
            avatarUrl: userData.photoURL,
          }),
        }),
      );
    }

    case 'IDENTITY_LINKED':
      return addIdentityProvider(
        state,
        action.payload.user,
        action.payload.credential,
      );

    case 'IDENTITY_UNLINKED':
      return state.deleteIn([
        'account',
        'identityProviders',
        action.payload.providerId,
      ]);

    case 'ACCOUNT_MIGRATION_NEEDED':
      return state.set(
        'currentMigration',
        new AccountMigration({
          userAccountToMerge: createUserAccountFromProfileAndCredential(
            action.payload.profile,
            action.payload.credential,
          ),
          firebaseCredential: action.payload.credential,
        }),
      );

    case 'START_ACCOUNT_MIGRATION':
      return state.setIn(
        ['currentMigration', 'state'],
        AccountMigrationState.UNDO_GRACE_PERIOD,
      );

    case 'DISMISS_ACCOUNT_MIGRATION':
      return state.delete('currentMigration');

    case 'ACCOUNT_MIGRATION_UNDO_PERIOD_EXPIRED':
      return state.setIn(
        ['currentMigration', 'state'],
        AccountMigrationState.IN_PROGRESS,
      );

    case 'ACCOUNT_MIGRATION_COMPLETE':
      return addIdentityProvider(
        state.setIn(
          ['currentMigration', 'state'],
          AccountMigrationState.COMPLETE,
        ),
        action.payload.user,
        action.payload.credential,
      );

    case 'ACCOUNT_MIGRATION_ERROR':
      return state.setIn(
        ['currentMigration', 'state'],
        AccountMigrationState.ERROR,
      );

    case 'USER_LOGGED_OUT':
      return new User().set('loginState', LoginState.ANONYMOUS);

    default:
      return state;
  }
}

export default user;
