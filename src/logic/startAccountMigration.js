import {createLogic} from 'redux-logic';

import {migrateAccount} from '../clients/firebase';
import {
  accountMigrationComplete,
  accountMigrationError,
  accountMigrationUndoPeriodExpired,
} from "../actions/user";
import {getCurrentAccountMigration} from "../selectors";
import {bugsnagClient} from "../util/bugsnag";
import { first } from 'rxjs/operators';

export default createLogic({
  type: 'START_ACCOUNT_MIGRATION',
  async process({action$}) {
    const continuePromise = new Promise((resolve) => {
      setTimeout(resolve, 5000, false);
    });

    const cancelPromise = action$.pipe(first(
      ({type}) => type === 'DISMISS_ACCOUNT_MIGRATION',
      false,
    )).toPromise();

    const shouldCancel = await Promise.race([
      continuePromise,
      cancelPromise,
    ]);

    if (shouldCancel) {
      console.log('aborting');
      return;
    }

    console.log('continuing');

    // await put(accountMigrationUndoPeriodExpired());
    // const {firebaseCredential} = await select(getCurrentAccountMigration);
    // try {
    //   const {user: userData, migratedProjects} =
    //     await call(migrateAccount, firebaseCredential);
    //
    //   await put(accountMigrationComplete(
    //     userData,
    //     firebaseCredential,
    //     migratedProjects,
    //   ));
    // } catch (e) {
    //   await call([bugsnagClient, 'notify'], e);
    //   await put(accountMigrationError(e));
    // }
  },
});
