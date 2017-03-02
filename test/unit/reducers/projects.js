import test from 'tape';
import reduce from 'lodash/reduce';
import reducer from '../../../src/reducers/projects';
import {
  changeCurrentProject,
  projectCreated,
  projectSourceEdited,
} from '../../../src/actions/projects';
import {
  isPristineProject,
} from '../../../src/util/projectUtils';

const defaultProjects = reducer(undefined, {type: null});

test('projectCreated', (t) => {
  t.test('from pristine state', (assert) => {
    assert.plan(2);

    const projectKey = '12345';
    const projects =
      reducer(initProjects(), projectCreated(projectKey));
    assert.deepEqual(Array.from(projects.keys()), [projectKey]);

    const project = projects.get(projectKey);
    assert.equal(project.getIn(['sources', 'css']), '');
  });

  t.test('with existing projects', (assert) => {
    assert.plan(2);

    let projects = initProjects({1: true, 2: false});
    assert.deepEqual(Array.from(projects.keys()).sort(), ['1', '2']);

    projects = reducer(projects, projectCreated('3'));
    assert.deepEqual(Array.from(projects.keys()).sort(), ['1', '3']);
  });
});

test('projectSourceEdited', (assert) => {
  assert.plan(3);

  const projectKey = '12345';
  const css = 'p {}';
  const timestamp = Date.now();
  let projects = initProjects({[projectKey]: false});
  assert.ok(isPristineProject(projects.get(projectKey)));

  projects = reducer(
    projects,
    projectSourceEdited(projectKey, 'css', css, timestamp),
  );
  assert.notOk(isPristineProject(projects.get(projectKey)));

  assert.equal(projects.getIn([projectKey, 'sources', 'css']), css);
});

test('changeCurrentProject', (assert) => {
  assert.plan(4);

  let projects = initProjects({1: true, 2: true, 3: false});
  assert.deepEqual(Array.from(projects.keys()).sort(), ['1', '2', '3']);

  projects = reducer(projects, changeCurrentProject('3'));
  assert.deepEqual(Array.from(projects.keys()).sort(), ['1', '2', '3']);

  projects = reducer(projects, changeCurrentProject('2'));
  assert.deepEqual(Array.from(projects.keys()).sort(), ['1', '2']);

  projects = reducer(projects, changeCurrentProject('1'));
  assert.deepEqual(Array.from(projects.keys()).sort(), ['1', '2']);
});

function initProjects(map = {}) {
  return reduce(map, (projectsIn, modified, projectKey) => {
    const projects = reducer(projectsIn, projectCreated(projectKey));
    if (modified) {
      return reducer(
        projects,
        projectSourceEdited(projectKey, 'css', '', Date.now()),
      );
    }
    return projects;
  }, defaultProjects);
}
