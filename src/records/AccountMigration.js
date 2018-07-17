import {Record} from 'immutable';

import {AccountMigrationState} from '../enums';

export default Record({
  state: AccountMigrationState.PROPOSED,
  credentialToMerge: null,
}, 'AccountMigration');
