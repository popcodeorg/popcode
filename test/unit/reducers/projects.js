import test from 'tape';
import reduce from 'lodash/reduce';
import partial from 'lodash/partial';
import defaults from 'lodash/defaults';
import Immutable from 'immutable';
import reducerTest from '../../helpers/reducerTest';
import {projects as states} from '../../helpers/referenceStates';
import {gistData} from '../../helpers/factory';
import reducer from '../../../src/reducers/projects';
import {
  changeCurrentProject,
  gistImported,
  projectCreated,
  projectSourceEdited,
} from '../../../src/actions/projects';

const now = Date.now();
const projectKey = '12345';

const html = '<!doctype html>Hey';
const css = 'p {}';

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

test('gistImported', (t) => {
  t.test('HTML and CSS, no JSON', reducerTest(
    reducer,
    states.initial,
    partial(
      gistImported,
      projectKey,
      gistData({html, css}),
    ),
    new Immutable.Map({
      [projectKey]: buildProject(projectKey, {html, css, javascript: ''}),
    }),
  ));

  t.test('CSS, no JSON', reducerTest(
    reducer,
    states.initial,
    partial(
      gistImported,
      projectKey,
      gistData({css}),
    ),
    new Immutable.Map({
      [projectKey]: buildProject(projectKey, {html: '', css, javascript: ''}),
    }),
  ));

  t.test('HTML, CSS, JSON', reducerTest(
    reducer,
    states.initial,
    partial(
      gistImported,
      projectKey,
      gistData({html, css, enabledLibraries: ['jquery']}),
    ),
    new Immutable.Map({
      [projectKey]: buildProject(
        projectKey,
        {html, css, javascript: ''},
        ['jquery'],
      ),
    }),
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

function buildProject(key, sources, enabledLibraries = []) {
  return Immutable.fromJS({
    projectKey: key,
    sources: defaults(
      sources,
      {
        html: '<!doctype html><html></html>',
        css: '',
        javascript: '',
      },
    ),
    enabledLibraries: new Immutable.Set(enabledLibraries),
  });
}
