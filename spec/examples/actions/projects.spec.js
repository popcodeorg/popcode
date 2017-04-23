/* eslint-env mocha */

import '../../helper';
import {assert} from 'chai';

import createApplicationStore from '../../../src/createApplicationStore';

import {
  createProject,
} from '../../../src/actions';

import {
  getProjectKeys,
  getCurrentProject,
  isPristineProject,
} from '../../../src/util/projectUtils';

describe('projectActions', () => {
  let store;

  beforeEach(() => {
    store = createApplicationStore();
  });

  describe('createProject', () => {
    it('creates a new project', () => {
      const previousKeys = getProjectKeys(store.getState());
      store.dispatch(createProject());
      assert.notInclude(
        previousKeys,
        getCurrentProject(store.getState()).projectKey,
      );
    });

    it('creates a project that is pristine', () => {
      store.dispatch(createProject());
      assert(
        isPristineProject(getCurrentProject(store.getState())),
        'project should be pristine',
      );
    });
  });
});
