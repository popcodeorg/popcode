/* eslint-env mocha */

import '../../helper';
import {assert} from 'chai';
import toArray from 'lodash/toArray';

import createApplicationStore from '../../../src/createApplicationStore';

import {
  createProject,
} from '../../../src/actions/projects';

describe('projectActions', () => {
  let store;

  beforeEach(() => {
    store = createApplicationStore();
  });

  describe('createProject', () => {
    it('creates a new project', () => {
      const previousKeys = getProjectKeys(store);
      store.dispatch(createProject());
      assert.notInclude(
        previousKeys,
        getCurrentProject(store).projectKey
      );
    });
  });
});

function getProjectKeys(store) {
  const state = store.getState();
  return toArray(state.projects.keys());
}

function getCurrentProject(store) {
  const state = store.getState();
  const projectKey = state.currentProject.get('projectKey');
  return state.projects.get(projectKey).toJS();
}
