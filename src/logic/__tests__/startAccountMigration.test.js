import startAccountMigration from '../startAccountMigration';
import {dismissAccountMigration} from '../../actions';

import { Observable } from 'rxjs';

describe('startAccountMigration', () => {
  test(
    'dismissed during undo period',
    async() => {
      const cancelDispatch = new Observable(subscriber => {
        subscriber.next({type: 'DISMISS_ACCOUNT_MIGRATION'});
        subscriber.complete();
      });
      const test = await startAccountMigration.process({action$: cancelDispatch});
      // expect(setTimeout).not.toHaveBeenCalled();
    });
});
