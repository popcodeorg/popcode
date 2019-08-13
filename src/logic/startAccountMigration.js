import {createLogic} from 'redux-logic';

import {first} from 'rxjs/operators';

import {migrateAccount} from '../clients/firebase';
import {
  accountMigrationComplete,
  accountMigrationError,
  accountMigrationUndoPeriodExpired,
} from '../actions/user';
import {getCurrentAccountMigration} from '../selectors';
import {bugsnagClient} from '../util/bugsnag';

export default createLogic({
  type: 'START_ACCOUNT_MIGRATION',
  async process({getState, action$}, dispatch, done) {
    const continuePromise = new Promise(resolve => {
      setTimeout(resolve, 5000, false);
    });

    const cancelPromise = action$
      .pipe(first(({type}) => type === 'DISMISS_ACCOUNT_MIGRATION'))
      .toPromise();

    const shouldCancel = await Promise.race([continuePromise, cancelPromise]);

    if (shouldCancel) {
      return;
    }

    await dispatch(accountMigrationUndoPeriodExpired());
    const {firebaseCredential} = await getCurrentAccountMigration(getState());
    try {
      const {user: userData, migratedProjects} = await migrateAccount(
        firebaseCredential,
      );

      await dispatch(
        accountMigrationComplete(
          userData,
          firebaseCredential,
          migratedProjects,
        ),
      );
    } catch (e) {
      await bugsnagClient.notify(e);
      await dispatch(accountMigrationError(e));
    }
    done();
  },
});
