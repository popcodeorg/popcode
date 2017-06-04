import test from 'tape';
import reduce from 'lodash/reduce';
import tap from 'lodash/tap';
import partial from 'lodash/partial';
import defaults from 'lodash/defaults';
import Immutable from 'immutable';
import reducerTest from '../../helpers/reducerTest';
import {projects as states} from '../../helpers/referenceStates';
import {gistData, project} from '../../helpers/factory';
import reducer, {
  reduceRoot as rootReducer,
} from '../../../src/reducers/projects';
import {
  changeCurrentProject,
  gistImported,
  projectCreated,
  projectLoaded,
  toggleLibrary,
  hideComponent,
  unhideComponent,
  updateProjectSource,
} from '../../../src/actions/projects';
import {
  focusLine,
} from '../../../src/actions/ui';
import {userLoggedOut} from '../../../src/actions/user';

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

test('updateProjectSource', reducerTest(
  reducer,
  initProjects({[projectKey]: false}),
  partial(updateProjectSource, projectKey, 'css', css, now),
  initProjects({[projectKey]: true}).
    update(
      projectKey,
      editedProject => editedProject.setIn(['sources', 'css'], css),
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
      gistData({
        html,
        css,
        enabledLibraries: ['jquery'],
        hiddenUIComponents: ['output'],
      }),
    ),
    new Immutable.Map({
      [projectKey]: buildProject(
        projectKey,
        {html, css, javascript: ''},
        ['jquery'],
        ['output'],
      ),
    }),
  ));
});

tap(project(), projectIn =>
  test('loadProject', reducerTest(
    reducer,
    states.initial,
    partial(projectLoaded, projectIn),
    new Immutable.Map().set(
      projectIn.projectKey,
      buildProject(
        projectIn.projectKey,
        projectIn.sources,
      ).set('updatedAt', projectIn.updatedAt),
    ),
  )),
);

tap(initProjects({1: true, 2: true}), projects =>
  test('userLoggedOut', reducerTest(
    rootReducer,
    Immutable.fromJS({currentProject: {projectKey: '1'}, projects}),
    userLoggedOut,
    Immutable.fromJS({
      currentProject: {projectKey: '1'},
      projects: projects.take(1),
    }),
  )),
);

tap(initProjects({1: false}), projects =>
  test('toggleLibrary', reducerTest(
    reducer,
    projects,
    partial(toggleLibrary, '1', 'jquery', now),
    projects.update('1', projectIn =>
      projectIn.set('enabledLibraries', new Immutable.Set(['jquery'])).
        set('updatedAt', now),
    ),
  )),
);

tap(initProjects({1: true}), projects =>
  test('hideComponent', reducerTest(
    reducer,
    projects,
    partial(hideComponent, '1', 'output', now),
    projects.update('1', projectIn =>
      projectIn.set('hiddenUIComponents', new Immutable.Set(['output'])),
    ),
  )),
);

tap(initProjects({1: true}), projects =>
  test('unhideComponent', reducerTest(
    reducer,
    projects.update('1', projectIn =>
      projectIn.set('hiddenUIComponents', new Immutable.Set(['output'])),
    ),
    partial(unhideComponent, '1', 'output', now),
    projects,
  )),
);

tap(initProjects({1: true}), (projects) => {
  const timestamp = Date.now();
  test('focusLine', reducerTest(
    rootReducer,
    Immutable.fromJS({
      projects: projects.setIn(
        ['1', 'hiddenUIComponents'],
        new Immutable.Set(['editor.javascript']),
      ),
      currentProject: {projectKey: '1'},
    }),
    partial(focusLine, 'javascript', 1, 1, timestamp),
    Immutable.fromJS({
      projects: projects.setIn(['1', 'updatedAt'], timestamp),
      currentProject: {projectKey: '1'},
    }),
  ));
});

function initProjects(map = {}) {
  return reduce(map, (projectsIn, modified, key) => {
    const projects = reducer(projectsIn, projectCreated(key));
    if (modified) {
      return reducer(
        projects,
        updateProjectSource(key, 'css', '', now),
      );
    }
    return projects;
  }, states.initial);
}

function buildProject(
  key, sources, enabledLibraries = [], hiddenUIComponents = [],
) {
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
    hiddenUIComponents: new Immutable.Set(hiddenUIComponents),
  });
}
