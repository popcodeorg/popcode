import {advanceBy, advanceTo} from 'jest-date-mock';
import omit from 'lodash-es/omit';
import {testSaga} from 'redux-saga-test-plan';
import {
  applicationLoaded as applicationLoadedSaga,
  archiveProject as archiveProjectSaga,
  changeCurrentProject as changeCurrentProjectSaga,
  createProject as createProjectSaga,
  importGist as importGistSaga,
  importSnapshot as importSnapshotSaga,
  saveCurrentProject,
  toggleLibrary as toggleLibrarySaga,
  updateProjectSource as updateProjectSourceSaga,
  userAuthenticated as userAuthenticatedSaga,
} from '../projects';
import {
  archiveProject,
  gistImportError,
  gistNotFound,
  projectsLoaded,
  projectSuccessfullySaved,
  toggleLibrary,
  updateProjectInstructions,
  updateProjectSource,
} from '../../actions/projects';
import {
  projectRestoredFromLastSession,
  snapshotImportError,
  snapshotNotFound,
} from '../../actions/clients';
import {userAuthenticated} from '../../actions/user';
import applicationLoaded from '../../actions/applicationLoaded';
import {loadGistFromId} from '../../clients/github';
import {
  loadAllProjects,
  loadProjectSnapshot,
  saveProject,
} from '../../clients/firebase';
import {deprecated_Scenario as Scenario} from './migratedKarmaTestHelpers';
import {firebaseProjectFactory} from '@factories/data/firebase';
import {credentialFactory, userFactory} from '@factories/clients/firebase';
import {githubGistFactory} from '@factories/clients/github';
import {
  getCurrentProject,
  getCurrentUserId,
  getProject,
} from '../../selectors/index';

beforeEach(() => advanceTo());

test('createProject()', () => {
  let firstProjectKey;

  testSaga(createProjectSaga)
    .next()
    .inspect(({payload: {action}}) => {
      firstProjectKey = action.payload.projectKey;
      expect(firstProjectKey).toBeTruthy();
    })
    .next()
    .isDone();

  advanceBy(10);

  testSaga(createProjectSaga)
    .next()
    .inspect(({payload: {action}}) => {
      const secondProjectKey = action.payload.projectKey;
      expect(secondProjectKey).toBeTruthy();
      expect(secondProjectKey).not.toEqual(firstProjectKey);
    })
    .next()
    .isDone();
});

test('changeCurrentProject()', () => {
  const scenario = new Scenario();
  const userId = 'abc123';
  const currentProject = firebaseProjectFactory.build();
  const {projectKey} = currentProject;

  testSaga(changeCurrentProjectSaga)
    .next()
    .select(getCurrentProject)
    .next(currentProject)
    .select()
    .next(scenario.state)
    .call(getCurrentUserId, scenario.state)
    .next(userId)
    .call(getProject, scenario.state, {projectKey})
    .next(currentProject)
    .call(saveProject, userId, currentProject)
    .next()
    .put(projectSuccessfullySaved())
    .next()
    .isDone();
});

describe('applicationLoaded()', () => {
  test('with no gist or snapshot ID or rehydrated project', () => {
    testSaga(applicationLoadedSaga, applicationLoaded({gistId: null}))
      .next()
      .call(createProjectSaga)
      .next()
      .isDone();
  });

  test('with snapshot ID', () => {
    const snapshotKey = '123-abc';
    testSaga(applicationLoadedSaga, applicationLoaded({snapshotKey}))
      .next()
      .call(importSnapshotSaga, applicationLoaded({snapshotKey}))
      .next()
      .isDone();
  });

  test('with gist ID', () => {
    const gistId = '123abc';
    testSaga(applicationLoadedSaga, applicationLoaded({gistId}))
      .next()
      .call(importGistSaga, applicationLoaded({gistId}))
      .next()
      .isDone();
  });

  test('with rehydrated project', () => {
    const rehydratedProject = firebaseProjectFactory.build();
    testSaga(applicationLoadedSaga, applicationLoaded({rehydratedProject}))
      .next()
      .put(projectRestoredFromLastSession(rehydratedProject))
      .next()
      .isDone();
  });
});

describe('importSnapshot()', () => {
  const snapshotKey = 'abc-123';

  test('with successful import', () => {
    const projectData = omit(firebaseProjectFactory.build(), 'projectKey');
    testSaga(importSnapshotSaga, applicationLoaded({snapshotKey}))
      .next()
      .call(loadProjectSnapshot, snapshotKey)
      .next(projectData)
      .inspect(
        ({
          payload: {
            action: {
              type,
              payload: {projectKey, project: payloadProject},
            },
          },
        }) => {
          expect(type).toEqual('SNAPSHOT_IMPORTED');
          expect(payloadProject).toBe(projectData);
          expect(projectKey).toBeTruthy();
        },
      )
      .next()
      .isDone();
  });

  test('with import error', () => {
    const error = new Error();
    testSaga(importSnapshotSaga, applicationLoaded({snapshotKey}))
      .next()
      .call(loadProjectSnapshot, snapshotKey)
      .throw(error)
      .put(snapshotImportError(error))
      .next()
      .isDone();
  });

  test('with snapshot not found', () => {
    testSaga(importSnapshotSaga, applicationLoaded({snapshotKey}))
      .next()
      .call(loadProjectSnapshot, snapshotKey)
      .next(null)
      .put(snapshotNotFound())
      .next()
      .isDone();
  });
});

describe('importGist()', () => {
  const gistId = 'abc123';

  test('with successful import', () => {
    const saga = testSaga(importGistSaga, applicationLoaded({gistId}));

    saga.next().call(loadGistFromId, gistId);

    const gist = githubGistFactory.build({html: '<!doctype html>test'});
    saga.next(gist).inspect(effect => {
      expect(effect.type).toEqual('PUT');
      expect(effect.payload.action.type).toEqual('GIST_IMPORTED');
      expect(effect.payload.action.payload.projectKey).toBeTruthy();
      expect(effect.payload.action.payload.gistData).toEqual(gist);
    });

    saga.next().isDone();
  });

  test('with not found error', () => {
    testSaga(importGistSaga, applicationLoaded({gistId}))
      .next()
      .call(loadGistFromId, gistId)
      .throw(Object.create(new Error(), {response: {value: {status: 404}}}))
      .put(gistNotFound(gistId))
      .next()
      .isDone();
  });

  test('with other error', () => {
    testSaga(importGistSaga, applicationLoaded({gistId}))
      .next()
      .call(loadGistFromId, gistId)
      .throw(new Error())
      .put(gistImportError())
      .next()
      .isDone();
  });
});

test('userAuthenticated', () => {
  const scenario = new Scenario().logIn();
  const projects = [firebaseProjectFactory.build()];
  const user = userFactory.build();
  const credential = credentialFactory.build();
  testSaga(
    userAuthenticatedSaga,
    userAuthenticated({user, credentials: [credential]}),
  )
    .next()
    .inspect(effect => {
      expect(effect.type).toEqual('SELECT');
    })
    .next(scenario.state)
    .fork(saveCurrentProject)
    .next(scenario.state)
    .call(loadAllProjects, scenario.user.account.id)
    .next(projects)
    .put(projectsLoaded(projects))
    .next()
    .isDone();
});

test('updateProjectSource', () => {
  const scenario = new Scenario();
  const userId = 'abc123';
  const currentProject = firebaseProjectFactory.build();
  const {projectKey} = currentProject;
  testSaga(
    updateProjectSourceSaga,
    updateProjectSource(scenario.projectKey, 'css', 'p {}'),
  )
    .next()
    .select(getCurrentProject)
    .next(currentProject)
    .select()
    .next(scenario.state)
    .call(getCurrentUserId, scenario.state)
    .next(userId)
    .call(getProject, scenario.state, {projectKey})
    .next(currentProject)
    .call(saveProject, userId, currentProject)
    .next()
    .put(projectSuccessfullySaved())
    .next()
    .isDone();
});

test('updateProjectInstructions', () => {
  const scenario = new Scenario();
  const userId = 'abc123';
  const currentProject = firebaseProjectFactory.build();
  const {projectKey} = currentProject;
  testSaga(
    updateProjectSourceSaga,
    updateProjectInstructions(scenario.projectKey, '# Instructions'),
  )
    .next()
    .select(getCurrentProject)
    .next(currentProject)
    .select()
    .next(scenario.state)
    .call(getCurrentUserId, scenario.state)
    .next(userId)
    .call(getProject, scenario.state, {projectKey})
    .next(currentProject)
    .call(saveProject, userId, currentProject)
    .next()
    .put(projectSuccessfullySaved())
    .next()
    .isDone();
});

test('toggleLibrary', () => {
  const scenario = new Scenario();
  const userId = 'abc123';
  const currentProject = firebaseProjectFactory.build();
  const {projectKey} = currentProject;
  testSaga(toggleLibrarySaga, toggleLibrary(scenario.projectKey, 'jquery'))
    .next()
    .select(getCurrentProject)
    .next(currentProject)
    .select()
    .next(scenario.state)
    .call(getCurrentUserId, scenario.state)
    .next(userId)
    .call(getProject, scenario.state, {projectKey})
    .next(currentProject)
    .call(saveProject, userId, currentProject)
    .next()
    .put(projectSuccessfullySaved())
    .next()
    .isDone();
});

test('archiveProject', () => {
  const scenario = new Scenario();
  const userId = 'abc123';
  const currentProject = firebaseProjectFactory.build();
  const {projectKey} = currentProject;
  testSaga(archiveProjectSaga, archiveProject(projectKey))
    .next()
    .select()
    .next(scenario.state)
    .call(getCurrentUserId, scenario.state)
    .next(userId)
    .call(getProject, scenario.state, {projectKey})
    .next(currentProject)
    .call(saveProject, userId, currentProject)
    .next()
    .put(projectSuccessfullySaved())
    .next()
    .isDone();
});
