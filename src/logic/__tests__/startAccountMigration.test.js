import {Observable} from 'rxjs';

import startAccountMigration from '../startAccountMigration';
import {
  accountMigrationComplete,
  accountMigrationError,
  accountMigrationUndoPeriodExpired,
} from '../../actions/user';
import {migrateAccount} from '../../clients/firebase';
import {getCurrentAccountMigration} from '../../selectors';
import {bugsnagClient} from '../../util/bugsnag';

import {
  credentialFactory,
  firebaseErrorFactory,
  userFactory,
} from '@factories/clients/firebase';

import {
  firebaseRepositoryFactory,
} from '@factories/data/firebase';


jest.mock('../../actions/user.js');
jest.mock('../../clients/firebase.js');
jest.mock('../../selectors');
jest.mock('../../util/bugsnag.js');
jest.useFakeTimers();

describe('startAccountMigration', () => {
  const getState = jest.fn();
  const dispatch = jest.fn();
  const done = jest.fn();

  test('not dismissed during undo period, successful migration', async() => {
    const mockCredential = credentialFactory.build();
    getCurrentAccountMigration.mockResolvedValue({
      firebaseCredential: mockCredential,
    });

    const mockUser = userFactory.build();
    const mockProjects = [
      firebaseRepositoryFactory.build(),
      firebaseRepositoryFactory.build(),
    ];
    migrateAccount.mockResolvedValue({
      user: mockUser,
      migratedProjects: mockProjects,
    });

    const emptyAction = new Observable();

    // eslint-disable-next-line promise/prefer-await-to-then
    Promise.resolve().then(() => jest.advanceTimersByTime(5000));
    await startAccountMigration.process(
      {action$: emptyAction, getState},
      dispatch,
      done,
    );

    expect(accountMigrationUndoPeriodExpired).toHaveBeenCalledWith();
    expect(migrateAccount).toHaveBeenCalledWith(mockCredential);
    expect(accountMigrationComplete).toHaveBeenCalledWith(
      mockUser,
      mockCredential,
      mockProjects,
    );
  });

  test('not dismissed during undo period, error in migration', async() => {
    const mockCredential = credentialFactory.build();
    getCurrentAccountMigration.mockResolvedValue({
      firebaseCredential: mockCredential,
    });

    const migrationError = firebaseErrorFactory.build();
    migrateAccount.mockRejectedValue(migrationError);

    bugsnagClient.notify.mockResolvedValue();

    const emptyAction = new Observable();

    // eslint-disable-next-line promise/prefer-await-to-then
    Promise.resolve().then(() => jest.advanceTimersByTime(5000));
    await startAccountMigration.process(
      {action$: emptyAction, getState},
      dispatch,
      done,
    );

    expect(accountMigrationUndoPeriodExpired).toHaveBeenCalledWith();
    expect(migrateAccount).toHaveBeenCalledWith(mockCredential);
    expect(accountMigrationComplete).not.toHaveBeenCalled();
    expect(bugsnagClient.notify).toHaveBeenCalledWith(migrationError);
    expect(accountMigrationError).toHaveBeenCalledWith(migrationError);
  });

  test('dismissed during undo period', async() => {
    const cancelAction = new Observable((subscriber) => {
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
