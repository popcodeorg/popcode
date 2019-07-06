import {Record} from 'immutable';

import {AccountMigrationState} from '../enums';

export default Record(
  {
    state: AccountMigrationState.PROPOSED,
    userAccountToMerge: null,
    firebaseCredential: null,
  },
  'AccountMigration',
);
