/* eslint-env mocha */
/* global sinon */

import {assert} from 'chai';
import '../../helper';
import MockFirebase,
  {createUser} from '../../helpers/MockFirebase';
import dispatchAndWait from '../../helpers/dispatchAndWait';
import createAndMutateProject from '../../helpers/createAndMutateProject';
import {getCurrentProject} from '../../../src/util/projectUtils';
import {applicationLoaded, logOut} from '../../../src/actions';
import createApplicationStore from '../../../src/createApplicationStore';

describe('user actions', () => {
  let store, sandbox, mockFirebase;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    mockFirebase = new MockFirebase(sandbox);
    store = createApplicationStore();
  });

  afterEach(() => {
    sandbox.restore();
  });

  const user = createUser();

  describe('logOut', () => {
    let loggedInProjectKey;

    beforeEach(async () => {
      mockFirebase.logIn(user.uid);
      mockFirebase.setCurrentProject(null);
      await dispatchAndWait(store, applicationLoaded());
      createAndMutateProject(store);
      loggedInProjectKey = getCurrentProject(store.getState()).projectKey;
      return dispatchAndWait(store, logOut());
    });

    it('should set authenticated to false', () => {
      assert.isFalse(store.getState().getIn(['user', 'authenticated']));
    });

    it('should set user id to null', () => {
      assert.isUndefined(store.getState().getIn(['user', 'id']));
    });

    it('should retain current project', () => {
      assert.equal(
        getCurrentProject(store.getState()).projectKey,
        loggedInProjectKey,
      );
    });
  });
});
