import test from 'tape';
import reduce from 'lodash/reduce';
import tap from 'lodash/tap';
import partial from 'lodash/partial';
import Immutable from 'immutable';
import reducerTest from '../../helpers/reducerTest';
import {projects as states} from '../../helpers/referenceStates';
import {gistData, project} from '../../helpers/factory';
import {Project} from '../../../src/records';
import reducer, {
  reduceRoot as rootReducer,
} from '../../../src/reducers/projects';
import {
  changeCurrentProject,
  gistImported,
  projectCreated,
  projectsLoaded,
  toggleLibrary,
  hideComponent,
  unhideComponent,
  toggleComponent,
  updateProjectSource,
} from '../../../src/actions/projects';
import {
  snapshotImported,
  projectRestoredFromLastSession,
} from '../../../src/actions/clients';
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

tap(project(), importedProject =>
  test('snapshotImported', reducerTest(
    reducer,
    states.initial,
    partial(
      snapshotImported,
      importedProject,
    ),
    states.initial.set(
      importedProject.projectKey,
      Project.fromJS(importedProject),
    ),
  )),
);

tap(project(), rehydratedProject =>
  test('projectRestoredFromLastSession', reducerTest(
    reducer,
    states.initial,
    partial(
      projectRestoredFromLastSession,
      rehydratedProject,
    ),
    states.initial.set(
      rehydratedProject.projectKey,
      Project.fromJS(rehydratedProject),
    ),
  )),
);

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
        ['output', 'console'],
      ),
    }),
  ));
});

tap([project(), project()], projectsIn =>
  test('projectsLoaded', reducerTest(
    reducer,
    states.initial,
    partial(projectsLoaded, projectsIn),
    projectsIn.reduce(
      (map, projectIn) => map.set(
        projectIn.projectKey,
        buildProject(
          projectIn.projectKey,
          projectIn.sources,
        ).set('updatedAt', projectIn.updatedAt),
      ),
      new Immutable.Map(),
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
    projects.updateIn(
      ['1', 'hiddenUIComponents'],
      components => components.add('output'),
    ),
  )),
);

tap(initProjects({1: true}), projects =>
  test('unhideComponent', reducerTest(
    reducer,
    projects.updateIn(
      ['1', 'hiddenUIComponents'],
      components => components.add('output'),
    ),
    partial(unhideComponent, '1', 'output', now),
    projects,
  )),
);

test('toggleComponent', (t) => {
  const projects = initProjects({1: true});

  t.test('with component visible', reducerTest(
    reducer,
    projects,
    partial(toggleComponent, '1', 'output', now),
    projects.updateIn(
      ['1', 'hiddenUIComponents'],
      components => components.add('output'),
    ),
  ));

  t.test('with component hidden', reducerTest(
    reducer,
    projects.updateIn(
      ['1', 'hiddenUIComponents'],
      components => components.add('output'),
    ),
    partial(toggleComponent, '1', 'output', now),
    projects,
  ));
});

tap(initProjects({1: true}), (projects) => {
  const timestamp = Date.now();
  test('focusLine', reducerTest(
    rootReducer,
    Immutable.fromJS({
      projects: projects.updateIn(
        ['1', 'hiddenUIComponents'],
        components => components.add('editor.javascript'),
      ),
      currentProject: {projectKey: '1'},
    }),
    partial(focusLine, 'editor.javascript', 1, 1, timestamp),
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
  key, sources, enabledLibraries = [], hiddenUIComponents = ['console'],
) {
  return Project.fromJS({
    projectKey: key,
    sources,
    enabledLibraries,
    hiddenUIComponents,
  });
}
