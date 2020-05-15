import Immutable from 'immutable';
import assign from 'lodash-es/assign';
import partial from 'lodash-es/partial';
import reduce from 'lodash-es/reduce';
import tap from 'lodash-es/tap';

import {gistData, project} from '../../../test/helpers/factory';
import {projects as states} from '../../../test/helpers/referenceStates';
import {
  projectExported,
  projectRestoredFromLastSession,
  snapshotImported,
} from '../../actions/clients';
import {
  archiveProject,
  changeCurrentProject,
  gistImported,
  hideComponent,
  projectCreated,
  projectsLoaded,
  toggleComponent,
  toggleLibrary,
  unhideComponent,
  updateProjectInstructions,
  updateProjectSource,
} from '../../actions/projects';
import {focusLine} from '../../actions/ui';
import {accountMigrationComplete, userLoggedOut} from '../../actions/user';
import {Project} from '../../records';
import reducer, {reduceRoot as rootReducer} from '../projects';

import {deprecatedReducerTest} from './migratedKarmaTestHelpers';

const now = Date.now();
const projectKey = '12345';

const html = '<!doctype html>Hey';
const css = 'p {}';

describe('projectCreated', () => {
  test(
    'from pristine state',
    deprecatedReducerTest(
      reducer,
      states.initial,
      partial(projectCreated, projectKey),
      initProjects({[projectKey]: false}),
      'creates one project',
    ),
  );

  test(
    'with existing projects',
    deprecatedReducerTest(
      reducer,
      initProjects({1: true, 2: false}),
      partial(projectCreated, projectKey),
      initProjects({1: true, 2: false, [projectKey]: false}),
    ),
  );
});

test(
  'updateProjectSource',
  deprecatedReducerTest(
    reducer,
    initProjects({[projectKey]: false}),
    partial(updateProjectSource, projectKey, 'css', css, now),
    initProjects({[projectKey]: true}).update(projectKey, editedProject =>
      editedProject.setIn(['sources', 'css'], css),
    ),
  ),
);

test(
  'updateProjectInstructions',
  deprecatedReducerTest(
    reducer,
    initProjects({[projectKey]: false}),
    partial(updateProjectInstructions, projectKey, '# Instructions', now),
    initProjects({[projectKey]: true}).update(projectKey, editedProject =>
      editedProject.set('instructions', '# Instructions'),
    ),
  ),
);

describe('changeCurrentProject', () => {
  test(
    'unArchiveProject',
    deprecatedReducerTest(
      reducer,
      initProjects({1: false}).setIn(['1', 'isArchived'], true),
      partial(changeCurrentProject, '1'),
      initProjects({1: false}).setIn(['1', 'isArchived'], false),
    ),
  );

  test(
    'from modified to pristine',
    deprecatedReducerTest(
      reducer,
      initProjects({1: true, 2: false}),
      partial(changeCurrentProject, '2'),
      initProjects({1: true, 2: false}),
      'keeps previous project in store',
    ),
  );

  test(
    'from pristine to modified',
    deprecatedReducerTest(
      reducer,
      initProjects({1: false, 2: true}),
      partial(changeCurrentProject, '2'),
      initProjects({2: true}),
      'drops pristine project',
    ),
  );

  test(
    'from modified to modified',
    deprecatedReducerTest(
      reducer,
      initProjects({1: true, 2: true}),
      partial(changeCurrentProject, '2'),
      initProjects({1: true, 2: true}),
      'keeps previous project in store',
    ),
  );
});

tap(project(), importedProject => {
  const snapshotProjectKey = '123454321';

  test(
    'snapshotImported',
    deprecatedReducerTest(
      reducer,
      states.initial,
      partial(snapshotImported, snapshotProjectKey, importedProject),
      states.initial.set(
        snapshotProjectKey,
        Project.fromJS(
          assign({}, importedProject, {
            projectKey: snapshotProjectKey,
            updatedAt: null,
          }),
        ),
      ),
    ),
  );
});

tap(project(), rehydratedProject =>
  test(
    'projectRestoredFromLastSession',
    deprecatedReducerTest(
      reducer,
      states.initial,
      partial(projectRestoredFromLastSession, rehydratedProject),
      states.initial.set(
        rehydratedProject.projectKey,
        Project.fromJS(rehydratedProject),
      ),
    ),
  ),
);

describe('gistImported', () => {
  test(
    'HTML and CSS, no JSON',
    deprecatedReducerTest(
      reducer,
      states.initial,
      partial(gistImported, projectKey, gistData({html, css})),
      new Immutable.Map({
        [projectKey]: buildProject(projectKey, {html, css, javascript: ''}),
      }),
    ),
  );

  test(
    'CSS, no JSON',
    deprecatedReducerTest(
      reducer,
      states.initial,
      partial(gistImported, projectKey, gistData({css})),
      new Immutable.Map({
        [projectKey]: buildProject(projectKey, {html: '', css, javascript: ''}),
      }),
    ),
  );

  test(
    'HTML, CSS, JSON',
    deprecatedReducerTest(
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
    ),
  );
});

tap([project(), project()], projectsIn => {
  test(
    'projectsLoaded',
    deprecatedReducerTest(
      reducer,
      states.initial,
      partial(projectsLoaded, projectsIn),
      projectsIn.reduce(
        (map, projectIn) =>
          map.set(
            projectIn.projectKey,
            buildProject(projectIn.projectKey, projectIn.sources).set(
              'updatedAt',
              projectIn.updatedAt,
            ),
          ),
        new Immutable.Map(),
      ),
    ),
  );

  tap(
    {providerData: [{providerId: 'google.com'}, {providerId: 'github.com'}]},
    firebaseUser => {
      test(
        'accountMigrationComplete',
        deprecatedReducerTest(
          reducer,
          states.initial,
          partial(accountMigrationComplete, firebaseUser, {}, projectsIn),
          projectsIn.reduce(
            (map, projectIn) =>
              map.set(
                projectIn.projectKey,
                buildProject(projectIn.projectKey, projectIn.sources).set(
                  'updatedAt',
                  projectIn.updatedAt,
                ),
              ),
            new Immutable.Map(),
          ),
        ),
      );
    },
  );
});

tap(initProjects({1: true, 2: true}), projects =>
  test(
    'userLoggedOut',
    deprecatedReducerTest(
      rootReducer,
      Immutable.fromJS({currentProject: {projectKey: '1'}, projects}),
      userLoggedOut,
      Immutable.fromJS({
        currentProject: {projectKey: '1'},
        projects: projects.take(1),
      }),
    ),
  ),
);

tap(initProjects({1: false}), projects =>
  test(
    'toggleLibrary',
    deprecatedReducerTest(
      reducer,
      projects,
      partial(toggleLibrary, '1', 'jquery', now),
      projects.update('1', projectIn =>
        projectIn
          .set('enabledLibraries', new Immutable.Set(['jquery']))
          .set('updatedAt', now),
      ),
    ),
  ),
);

tap(initProjects({1: true}), projects =>
  test(
    'hideComponent',
    deprecatedReducerTest(
      reducer,
      projects,
      partial(hideComponent, '1', 'output', now),
      projects.updateIn(['1', 'hiddenUIComponents'], components =>
        components.add('output'),
      ),
    ),
  ),
);

tap(initProjects({1: true}), projects =>
  test(
    'unhideComponent',
    deprecatedReducerTest(
      reducer,
      projects.updateIn(['1', 'hiddenUIComponents'], components =>
        components.add('output'),
      ),
      partial(unhideComponent, '1', 'output', now),
      projects,
    ),
  ),
);

describe('toggleComponent', () => {
  const projects = initProjects({1: true});

  test(
    'with component visible',
    deprecatedReducerTest(
      reducer,
      projects,
      partial(toggleComponent, '1', 'output', now),
      projects.updateIn(['1', 'hiddenUIComponents'], components =>
        components.add('output'),
      ),
    ),
  );

  test(
    'with component hidden',
    deprecatedReducerTest(
      reducer,
      projects.updateIn(['1', 'hiddenUIComponents'], components =>
        components.add('output'),
      ),
      partial(toggleComponent, '1', 'output', now),
      projects,
    ),
  );
});

tap(initProjects({1: true}), projects => {
  const timestamp = Date.now();
  test(
    'focusLine',
    deprecatedReducerTest(
      rootReducer,
      Immutable.fromJS({
        projects: projects.updateIn(['1', 'hiddenUIComponents'], components =>
          components.add('editor.javascript'),
        ),
        currentProject: {projectKey: '1'},
      }),
      partial(focusLine, 'editor.javascript', 1, 1, timestamp),
      Immutable.fromJS({
        projects: projects.setIn(['1', 'updatedAt'], timestamp),
        currentProject: {projectKey: '1'},
      }),
    ),
  );
});

tap(initProjects({1: true}), projects => {
  const timestamp = Date.now();
  const repoName = 'Page-Title-abc123';
  test(
    'gist export',
    deprecatedReducerTest(
      reducer,
      projects,
      partial(
        projectExported,
        'https://gist.github.com/abc123',
        'gist',
        '1',
        timestamp,
      ),
      projects,
      'is a no-op',
    ),
  );
  test(
    'repo export',
    deprecatedReducerTest(
      reducer,
      projects,
      partial(
        projectExported,
        'https://github.com/usernmaer/Page-Title-abc123',
        'repo',
        '1',
        {name: repoName},
        timestamp,
      ),
      projects
        .setIn(['1', 'updatedAt'], timestamp)
        .setIn(['1', 'externalLocations', 'githubRepoName'], repoName),
      'stores the repo name',
    ),
  );
});

tap(initProjects({1: false}), projects =>
  test(
    'archiveProject',
    deprecatedReducerTest(
      reducer,
      projects,
      partial(archiveProject, '1'),
      projects.setIn(['1', 'isArchived'], true),
    ),
  ),
);

function initProjects(map = {}) {
  return reduce(
    map,
    (projectsIn, modified, key) => {
      const projects = reducer(projectsIn, projectCreated(key));
      if (modified) {
        return reducer(projects, updateProjectSource(key, 'css', '', now));
      }
      return projects;
    },
    states.initial,
  );
}

function buildProject(
  key,
  sources,
  enabledLibraries = [],
  hiddenUIComponents = ['console'],
) {
  return Project.fromJS({
    projectKey: key,
    sources,
    enabledLibraries,
    hiddenUIComponents,
  });
}
