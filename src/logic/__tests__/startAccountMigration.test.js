import {Observable} from 'rxjs';
import reduce from 'lodash-es/reduce';

import rootReducer from '../../reducers';
import startAccountMigration from '../startAccountMigration';
import {
  accountMigrationComplete,
  accountMigrationError,
  accountMigrationNeeded,
  accountMigrationUndoPeriodExpired,
  startAccountMigration as startAccountMigrationAction,
  userAuthenticated,
  dismissAccountMigration,
} from '../../actions/user';
import {migrateAccount} from '../../clients/firebase';
import {bugsnagClient} from '../../util/bugsnag';

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
  const dispatch = jest.fn();
  const done = jest.fn();

  test('not dismissed during undo period, successful migration', async () => {
    const mockUser = userFactory.build();
    const mockCredential = credentialFactory.build();
    const mockProfile = githubProfileFactory.build();
    const mockProjects = firebaseProjectFactory.buildList(2);

    const state = applyActions(
      userAuthenticated(mockUser, mockCredential),
      accountMigrationNeeded(mockProfile, mockCredential),
      startAccountMigrationAction(),
      accountMigrationUndoPeriodExpired(),
      accountMigrationComplete(mockUser, mockCredential, mockProjects),
    );

    migrateAccount.mockResolvedValue({
      user: mockUser,
      migratedProjects: mockProjects,
    });

    const emptyAction = new Observable();
    const migrationDone = startAccountMigration.process(
      {action$: emptyAction, getState: () => state},
      dispatch,
      done,
    );
    jest.advanceTimersByTime(5000);
    await migrationDone;

    expect(migrateAccount).toHaveBeenCalledWith(mockCredential);
  });

  test('not dismissed during undo period, error in migration', async () => {
    const mockUser = userFactory.build();
    const mockCredential = credentialFactory.build();
    const mockProfile = githubProfileFactory.build();

    const migrationError = firebaseErrorFactory.build();
    const state = applyActions(
      userAuthenticated(mockUser, mockCredential),
      accountMigrationNeeded(mockProfile, mockCredential),
      startAccountMigrationAction(),
      accountMigrationUndoPeriodExpired(),
      accountMigrationError(),
    );

    migrateAccount.mockRejectedValue(migrationError);
    bugsnagClient.notify.mockResolvedValue();

    const emptyAction = new Observable();
    const migrationDone = startAccountMigration.process(
      {action$: emptyAction, getState: () => state},
      dispatch,
      done,
    );
    jest.advanceTimersByTime(5000);
    await migrationDone;

    expect(migrateAccount).toHaveBeenCalledWith(mockCredential);
    expect(bugsnagClient.notify).toHaveBeenCalledWith(migrationError);
  });

  test('dismissed during undo period', async () => {
    const mockUser = userFactory.build();
    const mockCredential = credentialFactory.build();
    const mockProfile = githubProfileFactory.build();

    const cancelAction = new Observable(subscriber => {
      subscriber.next({type: 'DISMISS_ACCOUNT_MIGRATION'});
      subscriber.complete();
    });

    const state = applyActions(
      userAuthenticated(mockUser, mockCredential),
      accountMigrationNeeded(mockProfile, mockCredential),
      startAccountMigrationAction(),
      dismissAccountMigration(),
    );

    await startAccountMigration.process(
      {action$: cancelAction, getState: () => state},
      dispatch,
      done,
    );

    expect(migrateAccount).not.toHaveBeenCalledWith(mockCredential);
  });
});

function applyActions(...actions) {
  return reduce(actions, (state, action) => rootReducer(state, action), undefined);
}
