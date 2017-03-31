import test from 'tape';
import get from 'lodash/get';
import {call} from 'redux-saga/effects';
import {
  applicationLoaded as applicationLoadedSaga,
  createProject as createProjectSaga,
  changeCurrentProject as changeCurrentProjectSaga,
  importGist as importGistSaga,
} from '../../../src/sagas/projects';
import {changeCurrentProject} from '../../../src/actions/projects';
import {saveCurrentProject} from '../../../src/util/projectUtils';
import Gists from '../../../src/services/Gists';
import Scenario from '../../helpers/Scenario';

test('createProject()', (assert) => {
  assert.plan(3);

  const action1 = createProjectAndGetAction();
  assert.ok(action1, 'generator yields action');

  assert.equal(
    action1.type,
    'PROJECT_CREATED',
    'generator yields PROJECT_CREATED',
  );

  const action2 = createProjectAndGetAction();
  assert.notEqual(
    action1.payload.projectKey,
    action2.payload.projectKey,
    'projectKey is different for each successive action',
  );

  function createProjectAndGetAction() {
    return get(createProjectSaga().next(), 'value.PUT.action');
  }
});

test('changeCurrentProject()', (assert) => {
  assert.plan(3);

  const scenario = new Scenario();
  const saga = changeCurrentProjectSaga(
    changeCurrentProject(scenario.projectKey),
  );
  const selectEffect = saga.next().value;
  assert.ok(selectEffect.SELECT, 'invokes select effect');

  const {selector} = selectEffect.SELECT;
  const callSaveCurrentProjectEffect =
    saga.next(selector(scenario.state)).value;

  assert.deepEqual(
    callSaveCurrentProjectEffect,
    call(saveCurrentProject, scenario.state),
    'calls to save current project',
  );

  assert.ok(saga.next().done, 'generator completes');
});

test('applicationLoaded()', (t) => {
  t.test('with no gist ID', (assert) => {
    assert.plan(2);
    const saga = applicationLoadedSaga({gistId: null});
    const callEffect = saga.next().value;
    assert.deepEqual(
      callEffect,
      call(createProjectSaga),
      'calls createProject',
    );
    assert.ok(saga.next().done);
  });

  t.test('with gist ID', (assert) => {
    assert.plan(2);
    const gistId = '123abc';
    const saga = applicationLoadedSaga({gistId});
    const callEffect = saga.next().value;
    assert.deepEqual(
      callEffect,
      call(importGistSaga, gistId),
      'calls importGist',
    );
    assert.ok(saga.next().done);
  });
});

test('importGist()', (t) => {
  t.test('with successful import', (assert) => {
    const gistId = 'abc123';
    const saga = importGistSaga(gistId);

    const callEffect = saga.next().value;
    assert.deepEqual(
      callEffect,
      call(Gists.loadFromId, gistId, {authenticated: false}),
      'calls Gists client',
    );

    const gist = {files: [{language: 'HTML', content: ''}]};
    const putEffect = saga.next(gist).value;
    assert.ok(putEffect.PUT, 'yielded effect is a PUT');
    assert.equal(
      putEffect.PUT.action.type,
      'GIST_IMPORTED',
      'action is GIST_IMPORTED',
    );
    assert.ok(
      putEffect.PUT.action.payload.projectKey,
      'assigns a project key',
    );
    assert.deepEqual(
      putEffect.PUT.action.payload.gistData,
      gist,
      'includes gist in action payload',
    );

    assert.end();
  });
});
