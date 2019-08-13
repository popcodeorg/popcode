import test from 'tape-catch';
import partial from 'lodash-es/partial';
import tap from 'lodash-es/tap';
import {Map} from 'immutable';

import reducerTest from '../../helpers/reducerTest';
import {user as states} from '../../helpers/referenceStates';
import {userCredential} from '../../helpers/factory';
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
  accountMigrationError,
  identityUnlinked,
} from '../../../src/actions/user';
import {AccountMigrationState, LoginState} from '../../../src/enums';
import {
  AccountMigration,
  User,
  UserAccount,
  UserIdentityProvider,
} from '../../../src/records';

const userCredentialIn = userCredential();

const loggedOutState = new User({
  loginState: LoginState.ANONYMOUS,
});

const loggedInState = new User({
  loginState: LoginState.AUTHENTICATED,
  account: new UserAccount({
    id: userCredentialIn.user.uid,
    displayName: userCredentialIn.user.displayName,
    avatarUrl: userCredentialIn.user.photoURL,
    identityProviders: new Map({
      'google.com': new UserIdentityProvider({
        accessToken: userCredentialIn.credential.idToken,
        avatarUrl: userCredentialIn.user.photoURL,
        displayName: userCredentialIn.user.displayName,
      }),
    }),
  }),
});

test(
  'userAuthenticated',
  reducerTest(
    reducer,
    states.initial,
    partial(userAuthenticated, userCredentialIn.user, [
      userCredentialIn.credential,
    ]),
    loggedInState,
  ),
);

test(
  'identityLinked',
  reducerTest(
    reducer,
    loggedInState,
    partial(
      identityLinked,
      {
        displayName: 'Popcode User',
        photoURL: null,
        providerData: [
          {
            displayName: 'Popcode User',
            photoURL: null,
            providerId: 'github.com',
          },
        ],
      },
      {providerId: 'github.com', accessToken: 'abc'},
    ),
    loggedInState.setIn(
      ['account', 'identityProviders', 'github.com'],
      new UserIdentityProvider({
        displayName: 'Popcode User',
        accessToken: 'abc',
      }),
    ),
  ),
);

test(
  'identityUnlinked',
  reducerTest(
    reducer,
    loggedInState.setIn(
      ['account', 'identityProviders', 'github.com'],
      new UserIdentityProvider({
        displayName: 'Popcode User',
        accessToken: 'abc',
      }),
    ),
    partial(identityUnlinked, 'github.com'),
    loggedInState,
  ),
);

tap(
  [
    {name: 'Popcode User', avatar_url: 'https://github.com/popcodeuser.jpg'},
    {
      providerData: [
        {
          photoURL: 'https://google.com/face.jpg',
          displayName: 'Google User',
          providerId: 'google.com',
        },
        {
          photoURL: 'https://github.com/face.jpg',
          displayName: 'GitHub User',
          providerId: 'github.com',
        },
      ],
    },
    {providerId: 'github.com', accessToken: 'abc123'},
  ],

  ([githubProfile, firebaseUser, credential]) => {
    const proposedState = loggedInState.set(
      'currentMigration',
      new AccountMigration({
        userAccountToMerge: new UserAccount({
          avatarUrl: 'https://github.com/popcodeuser.jpg',
          displayName: 'Popcode User',
          identityProviders: new Map({
            'github.com': new UserIdentityProvider({
              accessToken: 'abc123',
              avatarUrl: 'https://github.com/popcodeuser.jpg',
              displayName: 'Popcode User',
            }),
          }),
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

    const completeState = undoGracePeriodState
      .setIn(['currentMigration', 'state'], AccountMigrationState.COMPLETE)
      .setIn(
        ['account', 'identityProviders', 'github.com'],
        new UserIdentityProvider({
          accessToken: credential.accessToken,
          avatarUrl: 'https://github.com/face.jpg',
          displayName: 'GitHub User',
        }),
      );

    const errorState = undoGracePeriodState.setIn(
      ['currentMigration', 'state'],
      AccountMigrationState.ERROR,
    );

    test(
      'accountMigrationNeeded',
      reducerTest(
        reducer,
        loggedInState,
        partial(accountMigrationNeeded, githubProfile, credential),
        proposedState,
      ),
    );

    test(
      'startAccountMigration',
      reducerTest(
        reducer,
        proposedState,
        startAccountMigration,
        undoGracePeriodState,
      ),
    );

    test(
      'dismissAccountMigration',
      reducerTest(
        reducer,
        proposedState,
        dismissAccountMigration,
        loggedInState,
      ),
    );

    test(
      'accountMigrationUndoPeriodExpired',
      reducerTest(
        reducer,
        undoGracePeriodState,
        accountMigrationUndoPeriodExpired,
        inProgressState,
      ),
    );

    test(
      'accountMigrationComplete',
      reducerTest(
        reducer,
        inProgressState,
        partial(accountMigrationComplete, firebaseUser, credential, []),
        completeState,
      ),
    );

    test(
      'accountMigrationError',
      reducerTest(
        reducer,
        inProgressState,
        partial(accountMigrationError, new Error('Error')),
        errorState,
      ),
    );
  },
);

test(
  'userLoggedOut',
  reducerTest(reducer, loggedInState, userLoggedOut, loggedOutState),
);
