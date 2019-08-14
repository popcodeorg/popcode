import {Observable} from 'rxjs';
import reduce from 'lodash-es/reduce';
import reduceRoot from '../../reducers/index';

import startAccountMigration from '../startAccountMigration';
import {
  accountMigrationComplete,
  accountMigrationError,
  accountMigrationNeeded,
  accountMigrationUndoPeriodExpired,
  startAccountMigration as startAccountMigrationAction,
} from '../../actions/user';
import {migrateAccount} from '../../clients/firebase';
import {getCurrentAccountMigration} from '../../selectors';
import {bugsnagClient} from '../../util/bugsnag';

import {
  credentialFactory,
  firebaseErrorFactory,
  userFactory,
} from '@factories/clients/firebase';
import {githubProfileFactory} from '@factories/clients/github';

import {firebaseProjectFactory} from '@factories/data/firebase';

// jest.mock('../../actions/user.js');
jest.mock('../../clients/firebase.js');
jest.mock('../../selectors');
jest.mock('../../util/bugsnag.js');
jest.useFakeTimers();

describe('startAccountMigration', () => {
  const getState = jest.fn();
  const dispatch = jest.fn();
  const done = jest.fn();

  test('not dismissed during undo period, successful migration', async () => {
    const mockCredential = credentialFactory.build();
    const mockProfile = githubProfileFactory.build();

    // getCurrentAccountMigration.mockReturnValue({
    //   firebaseCredential: mockCredential,
    // });

    const state = applyActions(
        // startAccountMigrationAction(),
        // accountMigrationUndoPeriodExpired(),
        accountMigrationNeeded(mockProfile, mockCredential),
    );

    const mockUser = userFactory.build();
    const mockProjects = [
      firebaseProjectFactory.build(),
      firebaseProjectFactory.build(),
    ];
    migrateAccount.mockResolvedValue({
      user: mockUser,
      migratedProjects: mockProjects,
    });

    const emptyAction = new Observable();
    const migrationDone = startAccountMigration.process(
      {action$: emptyAction, getState},
      dispatch,
      done,
    );
    jest.advanceTimersByTime(5000);
    await migrationDone;

    expect(accountMigrationUndoPeriodExpired).toHaveBeenCalledWith();
    expect(migrateAccount).toHaveBeenCalledWith(mockCredential);
    expect(accountMigrationComplete).toHaveBeenCalledWith(
      mockUser,
      mockCredential,
      mockProjects,
    );
  });

  test('not dismissed during undo period, error in migration', async () => {
    const mockCredential = credentialFactory.build();
    getCurrentAccountMigration.mockReturnValue({
      firebaseCredential: mockCredential,
    });

    const migrationError = firebaseErrorFactory.build();
    migrateAccount.mockRejectedValue(migrationError);

    bugsnagClient.notify.mockResolvedValue();

    const emptyAction = new Observable();
    const migrationDone = startAccountMigration.process(
      {action$: emptyAction, getState},
      dispatch,
      done,
    );
    jest.advanceTimersByTime(5000);
    await migrationDone;

    expect(accountMigrationUndoPeriodExpired).toHaveBeenCalledWith();
    expect(migrateAccount).toHaveBeenCalledWith(mockCredential);
    expect(accountMigrationComplete).not.toHaveBeenCalled();
    expect(bugsnagClient.notify).toHaveBeenCalledWith(migrationError);
    expect(accountMigrationError).toHaveBeenCalledWith(migrationError);
  });

  test('dismissed during undo period', async () => {
    const cancelAction = new Observable(subscriber => {
      subscriber.next({type: 'DISMISS_ACCOUNT_MIGRATION'});
      subscriber.complete();
    });
    await startAccountMigration.process(
      {action$: cancelAction, getState},
      dispatch,
      done,
    );
    expect(accountMigrationUndoPeriodExpired).not.toHaveBeenCalled();
  });
});

function applyActions(...actions) {
  return reduce(
      actions,
      (state, action) => reduceRoot(state, action),
      undefined,
  );
}
