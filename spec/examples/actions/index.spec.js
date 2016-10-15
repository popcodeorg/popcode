/* eslint-env mocha */
/* global sinon */

import '../../helper';
import {assert} from 'chai';

import createApplicationStore from '../../../src/createApplicationStore';

import {
  createProject,
} from '../../../src/actions/projects';

import {
  importProjectFromGist,
} from '../../../src/actions/index';

import {
  getProjectKeys,
  getCurrentProject,
} from '../../../src/util/projectUtils';

describe('indexActions', () => {
  let store;

  beforeEach(() => {
    store = createApplicationStore();
  });

  describe('importProjectFromGist', () => {
    it('sets enabledLibraries to default if no popcode.json exists', () => {
      const gistData = {
        files: {
          "index.html":
            {
              language: 'html',
              content: '<h1>Hello, world!</h1>',
            },
        },
      };
      store.dispatch(createProject());
      const currentProject = getCurrentProject(store.getState());
      store.dispatch(importProjectFromGist(currentProject.projectKey, gistData))
      const updatedProject = getCurrentProject(store.getState());
      assert.equal(updatedProject.enabledLibraries.length, 0);
    });

    it('sets enabledLibraries to the enabledLibarires property in popcode.json', () => {
      const gistData = {
        files: {
          "index.html": 
            {
              language: 'html',
              content: '<h1>Hello, world!</h1>',
            },
          "popcode.json":
            {
              language: 'json',
              filename: 'popcode.json',
              content: '{"enabledLibraries":["jquery"]}',
            },
        },
      };
      store.dispatch(createProject());
      const currentProject = getCurrentProject(store.getState());
      store.dispatch(importProjectFromGist(currentProject.projectKey, gistData))
      const updatedProject = getCurrentProject(store.getState());
      assert.equal(updatedProject.enabledLibraries.length, 1);
      assert.equal(updatedProject.enabledLibraries[0], "jquery");
    });

  });

});
