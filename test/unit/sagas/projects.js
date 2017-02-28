import test from 'tape';
import get from 'lodash/get';
import {call} from 'redux-saga/effects';
import {
  createProject as createProjectSaga,
  changeCurrentProject as changeCurrentProjectSaga,
} from '../../../src/sagas/projects';
import {
  projectCreated,
  changeCurrentProject,
} from '../../../src/actions/projects';
import {
  saveCurrentProject,
} from '../../../src/util/projectUtils';
import reduce from '../../../src/reducers';

test('createProject()', (assert) => {
  assert.plan(3);

  const action1 = createProjectAndGetAction();
  assert.ok(action1, 'generator yields action');

  assert.equal(action1.type, 'PROJECT_CREATED');

  const action2 = createProjectAndGetAction();
  assert.notEqual(action1.payload.projectKey, action2.payload.projectKey);

  function createProjectAndGetAction() {
    return get(createProjectSaga().next(), 'value.PUT.action');
  }
});

test('changeCurrentProject()', (assert) => {
  assert.plan(3);

  const projectKey = '123456';
  const state = reduce(undefined, projectCreated(projectKey));
  const saga = changeCurrentProjectSaga(changeCurrentProject(projectKey));
  const selectEffect = saga.next().value;
  assert.ok(selectEffect.SELECT);

  const {selector} = selectEffect.SELECT;
  const callEffect = saga.next(selector(state)).value;
  assert.deepEqual(callEffect, call(saveCurrentProject, state));

  assert.ok(saga.next().done);
});
