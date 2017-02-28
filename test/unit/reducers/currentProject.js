import test from 'tape';
import reduceCurrentProject from '../../../src/reducers/currentProject';
import {
  changeCurrentProject,
} from '../../../src/actions/projects';

test('changeCurrentProject', (assert) => {
  assert.plan(1);

  const projectKey1 = '12345';
  const state =
    reduceCurrentProject(undefined, changeCurrentProject(projectKey1));
  assert.equal(state.get('projectKey'), projectKey1);
});
