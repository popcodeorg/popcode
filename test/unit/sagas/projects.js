import test from 'tape';
import get from 'lodash/get';
import {createProject} from '../../../src/sagas/projects';

test('createProject()', (assert) => {
  assert.plan(3);

  const action1 = createProjectAndGetAction();
  assert.ok(action1, 'generator yields action');

  assert.equal(action1.type, 'PROJECT_CREATED');

  const action2 = createProjectAndGetAction();
  assert.notEqual(action1.payload.projectKey, action2.payload.projectKey);

  function createProjectAndGetAction() {
    return get(createProject().next(), 'value.PUT.action');
  }
});
