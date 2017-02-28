import test from 'tape';
import reduceProjects from '../../../src/reducers/projects';
import {projectCreated} from '../../../src/actions/projects';

test('projectCreated', (assert) => {
  assert.plan(2);

  const projectKey = '12345';
  const projects = reduceProjects(undefined, projectCreated(projectKey));
  assert.deepEqual(Array.from(projects.keys()), [projectKey]);

  const project = projects.get(projectKey);
  assert.equal(project.getIn(['sources', 'css']), '');
});
