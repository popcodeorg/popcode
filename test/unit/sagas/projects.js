/* eslint-disable prefer-reflect */

import test from 'tape';
import {testSaga} from 'redux-saga-test-plan';
import {
  applicationLoaded as applicationLoadedSaga,
  createProject as createProjectSaga,
  changeCurrentProject as changeCurrentProjectSaga,
  importGist as importGistSaga,
} from '../../../src/sagas/projects';
import {
  gistImportError,
  gistNotFound,
} from '../../../src/actions/projects';
import applicationLoaded from '../../../src/actions/applicationLoaded';
import {saveCurrentProject} from '../../../src/util/projectUtils';
import Gists from '../../../src/services/Gists';
import Scenario from '../../helpers/Scenario';
import {gistData} from '../../helpers/factory';

test('createProject()', (assert) => {
  let firstProjectKey;

  const clock = sinon.useFakeTimers();

  testSaga(createProjectSaga).
    next().inspect(({PUT: {action}}) => {
      firstProjectKey = action.payload.projectKey;
      assert.ok(
        firstProjectKey,
        'generator yields PUT action with project key',
      );
    }).
    next().isDone();

  clock.tick(10);

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

  clock.restore();

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
    testSaga(applicationLoadedSaga, applicationLoaded(null)).
      next().call(createProjectSaga).
      next().isDone();

    assert.end();
  });

  t.test('with gist ID', (assert) => {
    const gistId = '123abc';
    testSaga(applicationLoadedSaga, applicationLoaded(gistId)).
      next().call(importGistSaga, gistId).
      next().isDone();

    assert.end();
  });
});

test('importGist()', (t) => {
  const gistId = 'abc123';

  t.test('with successful import', (assert) => {
    const saga = testSaga(importGistSaga, gistId);

    saga.next().call(Gists.loadFromId, gistId, {authenticated: false});

    const gist = gistData({html: '<!doctype html>test'});
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

  t.test('with not found error', (assert) => {
    testSaga(importGistSaga, gistId).
      next().call(Gists.loadFromId, gistId, {authenticated: false}).
      throw(
        Object.create(new Error(), {response: {value: {status: 404}}}),
      ).put(gistNotFound(gistId)).
      next().isDone();
    assert.end();
  });

  t.test('with other error', (assert) => {
    testSaga(importGistSaga, gistId).
      next().call(Gists.loadFromId, gistId, {authenticated: false}).
      throw(new Error()).put(gistImportError()).
      next().isDone();
    assert.end();
  });
});
