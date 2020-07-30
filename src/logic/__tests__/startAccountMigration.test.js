import {
  accountMigrationComplete,
  accountMigrationError,
  accountMigrationNeeded,
  accountMigrationUndoPeriodExpired,
  dismissAccountMigration as dismissAccountMigrationAction,
  startAccountMigration as startAccountMigrationAction,
  userAuthenticated,
} from '../../actions/user';
import {migrateAccount} from '../../clients/firebase';
import {bugsnagClient} from '../../util/bugsnag';
import startAccountMigration from '../startAccountMigration';

import {applyActions, makeTestLogic} from './helpers';

import {
  credentialFactory,
  firebaseErrorFactory,
  userFactory,
} from '@factories/clients/firebase';
import {githubProfileFactory} from '@factories/clients/github';
import {firebaseProjectFactory} from '@factories/data/firebase';

jest.mock('../../clients/firebase');
jest.mock('../../util/bugsnag');
jest.useFakeTimers();

describe('startAccountMigration', () => {
  const testLogic = makeTestLogic(startAccountMigration);

  test('not dismissed during undo period, successful migration', async () => {
    const mockUser = userFactory.build();
    const mockCredential = credentialFactory.build();
    const mockProfile = githubProfileFactory.build();
    const mockProjects = firebaseProjectFactory.buildList(2);

    const state = applyActions(
      userAuthenticated(mockUser, [mockCredential]),
      accountMigrationNeeded(mockProfile, mockCredential),
      startAccountMigrationAction(),
      accountMigrationUndoPeriodExpired(),
      accountMigrationComplete(mockUser, mockCredential, mockProjects),
    );

    migrateAccount.mockResolvedValue({
      user: mockUser,
      migratedProjects: mockProjects,
    });

    await testLogic(startAccountMigrationAction(), {
      state,
      afterDispatch() {
        jest.advanceTimersByTime(5000);
      },
    });

    expect(migrateAccount).toHaveBeenCalledWith(mockCredential);
  });

  test('not dismissed during undo period, error in migration', async () => {
    const mockUser = userFactory.build();
    const mockCredential = credentialFactory.build();
    const mockProfile = githubProfileFactory.build();

    const migrationError = firebaseErrorFactory.build();
    const state = applyActions(
      userAuthenticated(mockUser, [mockCredential]),
      accountMigrationNeeded(mockProfile, mockCredential),
      startAccountMigrationAction(),
      accountMigrationUndoPeriodExpired(),
      accountMigrationError(),
    );

    migrateAccount.mockRejectedValue(migrationError);
    bugsnagClient.notify.mockResolvedValue();

    const migrationDone = testLogic(startAccountMigrationAction(), {
      state,
      afterDispatch() {
        jest.advanceTimersByTime(5000);
      },
    });
    await migrationDone;

    expect(migrateAccount).toHaveBeenCalledWith(mockCredential);
    expect(bugsnagClient.notify).toHaveBeenCalledWith(migrationError);
  });

  test('dismissed during undo period', async () => {
    const mockUser = userFactory.build();
    const mockCredential = credentialFactory.build();
    const mockProfile = githubProfileFactory.build();

    const state = applyActions(
      userAuthenticated(mockUser, [mockCredential]),
      accountMigrationNeeded(mockProfile, mockCredential),
      startAccountMigrationAction(),
      dismissAccountMigrationAction(),
    );

    await testLogic(startAccountMigrationAction(), {
      state,
      afterDispatch(store) {
        store.dispatch(dismissAccountMigrationAction());
      },
    });

    expect(migrateAccount).not.toHaveBeenCalledWith(mockCredential);
  });
});
