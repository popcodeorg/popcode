import {Map} from 'immutable';
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

function addIdentityProviderFromCredential(state, credential) {
  return state.setIn(
    ['account', 'identityProviders', credential.providerId],
    new UserIdentityProvider({accessToken: getToken(credential)}),
  );
}

function createUserAccountFromProfileAndCredential(profile, credential) {
  if (credential.providerId !== 'github.com') {
    throw new Error(`Unexpected credential provider ${credential.providerId}`);
  }

  return new UserAccount({
    displayName: profile.name || profile.login,
    avatarUrl: profile.avatar_url,
    identityProviders: new Map({
      'github.com': new UserIdentityProvider({
        accessToken: getToken(credential),
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
        addIdentityProviderFromCredential,
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
      return addIdentityProviderFromCredential(
        state,
        action.payload.credential,
      );

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
      return addIdentityProviderFromCredential(
        state.setIn(
          ['currentMigration', 'state'],
          AccountMigrationState.COMPLETE,
        ),
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
