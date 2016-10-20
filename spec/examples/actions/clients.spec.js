/* eslint-env mocha */

import '../../helper';
import createApplicationStore from '../../../src/createApplicationStore';
import {assert} from 'chai';

import {exportingGist} from '../../../src/actions/clients';

describe('clients', () => {
  let store;

  beforeEach(() => {
    store = createApplicationStore();
  });

  describe('exportingGist', () => {
    it('should initially set gists.exportInProgress to true', () => {
      const gistExportComplete = new Promise(() => {});
      store.dispatch(exportingGist(gistExportComplete));
      assert.isTrue(
        store.getState().clients.getIn(['gists', 'exportInProgress'])
      );
    });

    it('should set gists.exportInProgress to false after promise resolves',
      () => {
        const gistExportComplete = Promise.resolve();
        store.dispatch(exportingGist(gistExportComplete));
        return assert.eventually.isFalse(gistExportComplete.then(
          () => store.getState().clients.getIn(['gists', 'exportInProgress'])
        ));
      }
    );

    it('should set gists.exportInProgress to false after promise rejects',
      () => {
        const gistExportComplete = Promise.reject();
        store.dispatch(exportingGist(gistExportComplete));
        return assert.eventually.isFalse(gistExportComplete.catch(
          () => store.getState().clients.getIn(['gists', 'exportInProgress'])
        ));
      }
    );
  });
});
