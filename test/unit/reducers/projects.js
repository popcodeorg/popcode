import test from 'tape';
import reduce from 'lodash/reduce';
import partial from 'lodash/partial';
import reducerTest from '../../helpers/reducerTest';
import {projects as states} from '../../helpers/referenceStates';
import reducer from '../../../src/reducers/projects';
import {
  changeCurrentProject,
  projectCreated,
  projectSourceEdited,
} from '../../../src/actions/projects';

const now = Date.now();
const projectKey = '12345';

test('projectCreated', (t) => {
  t.test('from pristine state', reducerTest(
    reducer,
    states.initial,
    partial(projectCreated, projectKey),
    initProjects({[projectKey]: false}),
    'creates one project',
  ));

  t.test('with existing projects', reducerTest(
    reducer,
    initProjects({1: true, 2: false}),
    partial(projectCreated, projectKey),
    initProjects({1: true, 2: false, [projectKey]: false}),
  ));
});

const css = 'p {}';

test('projectSourceEdited', reducerTest(
  reducer,
  initProjects({[projectKey]: false}),
  partial(projectSourceEdited, projectKey, 'css', css, now),
  initProjects({[projectKey]: true}).
    update(
      projectKey,
      project => project.setIn(['sources', 'css'], css),
    ),
));

test('changeCurrentProject', (t) => {
  t.test('from modified to pristine', reducerTest(
    reducer,
    initProjects({1: true, 2: false}),
    partial(changeCurrentProject, '2'),
    initProjects({1: true, 2: false}),
    'keeps previous project in store',
  ));

  t.test('from pristine to modified', reducerTest(
    reducer,
    initProjects({1: false, 2: true}),
    partial(changeCurrentProject, '2'),
    initProjects({2: true}),
    'drops pristine project',
  ));

  t.test('from modified to modified', reducerTest(
    reducer,
    initProjects({1: true, 2: true}),
    partial(changeCurrentProject, '2'),
    initProjects({1: true, 2: true}),
    'keeps previous project in store',
  ));
});

function initProjects(map = {}) {
  return reduce(map, (projectsIn, modified, key) => {
    const projects = reducer(projectsIn, projectCreated(key));
    if (modified) {
      return reducer(
        projects,
        projectSourceEdited(key, 'css', '', now),
      );
    }
    return projects;
  }, states.init);
}
