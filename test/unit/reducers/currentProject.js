import test from 'tape';
import reduceCurrentProject from '../../../src/reducers/currentProject';
import {
  changeCurrentProject,
  projectCreated,
} from '../../../src/actions/projects';

test('projectCreated', (assert) => {
  assert.plan(1);

  const projectKey = '12345';
  const state =
    reduceCurrentProject(undefined, projectCreated(projectKey));
  assert.equal(state.get('projectKey'), projectKey);
});

test('changeCurrentProject', (assert) => {
  assert.plan(1);

  const projectKey = '12345';
  const state =
    reduceCurrentProject(undefined, changeCurrentProject(projectKey));
  assert.equal(state.get('projectKey'), projectKey);
});
