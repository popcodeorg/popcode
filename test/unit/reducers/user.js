import test from 'tape';
import partial from 'lodash-es/partial';
import tap from 'lodash-es/tap';
import {Map} from 'immutable';

import reducerTest from '../../helpers/reducerTest';
import {user as states} from '../../helpers/referenceStates';
import {userWithCredentials} from '../../helpers/factory';
import reducer from '../../../src/reducers/user';
import {
  accountMigrationComplete,
  accountMigrationNeeded,
  accountMigrationUndoPeriodExpired,
  dismissAccountMigration,
  identityLinked,
  startAccountMigration,
  userAuthenticated,
  userLoggedOut,
} from '../../../src/actions/user';
import {AccountMigrationState, LoginState} from '../../../src/enums';
import {AccountMigration, User, UserAccount} from '../../../src/records';

const userWithCredentialsIn = userWithCredentials();

const loggedOutState = new User({
  loginState: LoginState.ANONYMOUS,
});

const loggedInState = new User({
  loginState: LoginState.AUTHENTICATED,
  account: new UserAccount({
    id: userWithCredentialsIn.user.uid,
    displayName: userWithCredentialsIn.user.displayName,
    avatarUrl: userWithCredentialsIn.user.photoURL,
    accessTokens: new Map({
      'github.com': userWithCredentialsIn.credentials[0].accessToken,
    }),
  }),
});

test('userAuthenticated', reducerTest(
  reducer,
  states.initial,
  partial(
    userAuthenticated,
    userWithCredentialsIn.user,
    userWithCredentialsIn.credentials,
  ),
  loggedInState,
));

test('identityLinked', reducerTest(
  reducer,
  loggedInState,
  partial(
    identityLinked,
    {providerId: 'google.com', idToken: 'abc'},
  ),
  loggedInState.setIn(['account', 'accessTokens', 'google.com'], 'abc'),
));

tap(
  [
    {name: 'Popcode User', avatar_url: 'https://github.com/popcodeuser.jpg'},
    {providerId: 'github.com', accessToken: 'abc123'},
  ],
  ([githubProfile, credential]) => {
    const proposedState = loggedInState.set(
      'currentMigration',
      new AccountMigration({
        userAccountToMerge: new UserAccount({
          displayName: 'Popcode User',
          avatarUrl: 'https://github.com/popcodeuser.jpg',
          accessTokens: new Map({'github.com': 'abc123'}),
        }),
        firebaseCredential: credential,
      }),
    );

    const undoGracePeriodState = proposedState.setIn(
      ['currentMigration', 'state'],
      AccountMigrationState.UNDO_GRACE_PERIOD,
    );

    const inProgressState = undoGracePeriodState.setIn(
      ['currentMigration', 'state'],
      AccountMigrationState.IN_PROGRESS,
    );

    const completeState = undoGracePeriodState.setIn(
      ['currentMigration', 'state'],
      AccountMigrationState.COMPLETE,
    ).setIn(
      ['account', 'accessTokens', 'github.com'],
      credential.accessToken,
    );

    test('accountMigrationNeeded', reducerTest(
      reducer,
      loggedInState,
      partial(
        accountMigrationNeeded,
        githubProfile,
        credential,
      ),
      proposedState,
    ));

    test('startAccountMigration', reducerTest(
      reducer,
      proposedState,
      startAccountMigration,
      undoGracePeriodState,
    ));

    test('dismissAccountMigration', reducerTest(
      reducer,
      proposedState,
      dismissAccountMigration,
      loggedInState,
    ));

    test('accountMigrationUndoPeriodExpired', reducerTest(
      reducer,
      undoGracePeriodState,
      accountMigrationUndoPeriodExpired,
      inProgressState,
    ));

    test('accountMigrationComplete', reducerTest(
      reducer,
      inProgressState,
      partial(accountMigrationComplete, [], credential),
      completeState,
    ));
  },
);

test('userLoggedOut', reducerTest(
  reducer,
  loggedInState,
  userLoggedOut,
  loggedOutState,
));
