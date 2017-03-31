import test from 'tape';
import get from 'lodash/get';
import {call} from 'redux-saga/effects';
import {
  createProject as createProjectSaga,
  changeCurrentProject as changeCurrentProjectSaga,
} from '../../../src/sagas/projects';
import {
  changeCurrentProject,
} from '../../../src/actions/projects';
import {
  saveCurrentProject,
} from '../../../src/util/projectUtils';
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
