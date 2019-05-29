import {createLogic} from 'redux-logic';

import {migrateAccount} from '../clients/firebase';
import {
  accountMigrationComplete,
  accountMigrationError,
  accountMigrationUndoPeriodExpired,
} from "../actions/user";
import {getCurrentAccountMigration} from "../selectors";
import {bugsnagClient} from "../util/bugsnag";

export default createLogic({
  type: 'START_ACCOUNT_MIGRATION',
  cancelType: 'DISMISS_ACCOUNT_MIGRATION',
  async process() {

    setTimeout(() => true, 5000);

    const {shouldContinue} = await Promise.race({
      shouldContinue: delay(5000, true),
      cancel: take('DISMISS_ACCOUNT_MIGRATION'),
    });

    if (!shouldContinue) {
      return;
    }

    await put(accountMigrationUndoPeriodExpired());
    const {firebaseCredential} = await select(getCurrentAccountMigration);
    try {
      const {user: userData, migratedProjects} =
        await call(migrateAccount, firebaseCredential);

      await put(accountMigrationComplete(
        userData,
        firebaseCredential,
        migratedProjects,
      ));
    } catch (e) {
      await call([bugsnagClient, 'notify'], e);
      await put(accountMigrationError(e));
    }
  },
});
