import {Observable} from 'rxjs';

import {
  credentialFactory,
  firebaseErrorFactory,
  userFactory,
} from '@factories/clients/firebase';

import {
  githubRepositoryFactory,
} from '@factories/clients/github';

import startAccountMigration from '../startAccountMigration';
import {
  accountMigrationComplete,
  accountMigrationError,
  accountMigrationUndoPeriodExpired,
} from '../../actions/user';
import {migrateAccount} from '../../clients/firebase';
import {getCurrentAccountMigration} from '../../selectors';
import {bugsnagClient} from '../../util/bugsnag';

jest.mock('../../actions/user.js');
jest.mock('../../clients/firebase.js');
jest.mock('../../selectors');
jest.mock('../../util/bugsnag.js');

const getState = jest.fn();
const dispatch = jest.fn();
const done = jest.fn();

describe('startAccountMigration', () => {
  test('not dismissed during undo period, successful migration', async() => {
    const mockCredential = credentialFactory.build();
    getCurrentAccountMigration.mockResolvedValue({
      firebaseCredential: mockCredential,
    });

    const mockUser = userFactory.build();
    const mockProjects = [
      githubRepositoryFactory.build(),
      githubRepositoryFactory.build(),
    ];
    migrateAccount.mockResolvedValue({
      user: mockUser,
      migratedProjects: mockProjects,
    });

    const emptyDispatch = new Observable((subscriber) => {
      subscriber.complete();
    });
    await startAccountMigration.process(
      {action$: emptyDispatch, getState},
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

    const emptyDispatch = new Observable((subscriber) => {
      subscriber.complete();
    });
    await startAccountMigration.process(
      {action$: emptyDispatch, getState},
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
    const cancelDispatch = new Observable((subscriber) => {
      subscriber.next({type: 'DISMISS_ACCOUNT_MIGRATION'});
      subscriber.complete();
    });
    await startAccountMigration.process(
      {action$: cancelDispatch, getState},
      dispatch,
      done,
    );
    expect(accountMigrationUndoPeriodExpired).not.toHaveBeenCalled();
  });
});
