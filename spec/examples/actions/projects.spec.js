/* eslint-env mocha */
/* global sinon */

import '../../helper';
import {assert} from 'chai';

import createAndMutateProject from '../../helpers/createAndMutateProject';
import createApplicationStore from '../../../src/createApplicationStore';

import {
  createProject,
  changeCurrentProject,
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
        getCurrentProject(store.getState()).projectKey
      );
    });

    it('creates a project that is pristine', () => {
      store.dispatch(createProject());
      assert(
        isPristineProject(getCurrentProject(store.getState())),
        'project should be pristine'
      );
    });
  });

  describe('changeCurrentProject', () => {
    let projectKey, clock;

    beforeEach(() => {
      clock = sinon.useFakeTimers();
      projectKey = createAndMutateProject(store);
      clock.tick(1);
      createAndMutateProject(store);
      store.dispatch(changeCurrentProject(projectKey));
    });

    afterEach(() => {
      clock.restore();
    });

    it('changes to the specified project', () => {
      assert.equal(projectKey, getCurrentProject(store.getState()).projectKey);
    });

    it('keeps all projects in list', () => {
      assert.lengthOf(getProjectKeys(store.getState()), 2);
    });
  });
});
