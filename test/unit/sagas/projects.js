/* eslint-disable prefer-reflect */

import test from 'tape';
import {testSaga} from 'redux-saga-test-plan';
import {
  applicationLoaded as applicationLoadedSaga,
  createProject as createProjectSaga,
  changeCurrentProject as changeCurrentProjectSaga,
  importGist as importGistSaga,
} from '../../../src/sagas/projects';
import {saveCurrentProject} from '../../../src/util/projectUtils';
import Gists from '../../../src/services/Gists';
import Scenario from '../../helpers/Scenario';

test('createProject()', (assert) => {
  let firstProjectKey;

  testSaga(createProjectSaga).
    next().inspect(({PUT: {action}}) => {
      firstProjectKey = action.payload.projectKey;
      assert.ok(
        firstProjectKey,
        'generator yields PUT action with project key',
      );
    }).
    next().isDone();

  testSaga(createProjectSaga).
    next().inspect(({PUT: {action}}) => {
      const secondProjectKey = action.payload.projectKey;
      assert.ok(secondProjectKey, 'generator yields action with project key');
      assert.notEqual(
        secondProjectKey,
        firstProjectKey,
        'subsequent calls yield different project keys',
      );
    }).
    next().isDone();

  assert.end();
});

test('changeCurrentProject()', (assert) => {
  const scenario = new Scenario();
  testSaga(changeCurrentProjectSaga).
    next().inspect((effect) => {
      assert.ok(effect.SELECT, 'invokes select effect');
    }).
    next(scenario.state).call(saveCurrentProject, scenario.state).
    next().isDone();

  assert.end();
});

test('applicationLoaded()', (t) => {
  t.test('with no gist ID', (assert) => {
    testSaga(applicationLoadedSaga, {gistId: null}).
      next().call(createProjectSaga).
      next().isDone();

    assert.end();
  });

  t.test('with gist ID', (assert) => {
    const gistId = '123abc';
    testSaga(applicationLoadedSaga, {gistId}).
      next().call(importGistSaga, gistId).
      next().isDone();

    assert.end();
  });
});

test('importGist()', (t) => {
  t.test('with successful import', (assert) => {
    const gistId = 'abc123';
    const saga = testSaga(importGistSaga, gistId);

    saga.next().call(Gists.loadFromId, gistId, {authenticated: false});

    const gist = {files: [{language: 'HTML', content: ''}]};
    saga.next(gist).inspect((effect) => {
      assert.ok(effect.PUT, 'yielded effect is a PUT');
      assert.equal(
        effect.PUT.action.type,
        'GIST_IMPORTED',
        'action is GIST_IMPORTED',
      );
      assert.ok(
        effect.PUT.action.payload.projectKey,
        'assigns a project key',
      );
      assert.deepEqual(
        effect.PUT.action.payload.gistData,
        gist,
        'includes gist in action payload',
      );
    });

    saga.next().isDone();

    assert.end();
  });
});
