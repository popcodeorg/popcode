/* eslint-env mocha */

import {assert} from 'chai';
import '../../helper';
import createApplicationStore from '../../../src/createApplicationStore';

import {exportingGist} from '../../../src/actions';

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
        store.getState().getIn(['clients', 'gists', 'exportInProgress']),
      );
    });

    it('should set gists.exportInProgress to false after promise resolves',
      () => {
        const gistExportComplete = Promise.resolve();
        store.dispatch(exportingGist(gistExportComplete));
        return assert.eventually.isFalse(gistExportComplete.then(() =>
          store.getState().getIn(['clients', 'gists', 'exportInProgress']),
        ));
      },
    );

    it('should set gists.exportInProgress to false after promise rejects',
      () => {
        const gistExportComplete = Promise.reject();
        store.dispatch(exportingGist(gistExportComplete));
        return assert.eventually.isFalse(gistExportComplete.catch(() =>
          store.getState().getIn(['clients', 'gists', 'exportInProgress']),
        ));
      },
    );
  });
});
