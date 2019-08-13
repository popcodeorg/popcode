import omit from 'lodash-es/omit';
import test from 'tape-catch';
import {testSaga} from 'redux-saga-test-plan';
import {
  applicationLoaded as applicationLoadedSaga,
  createProject as createProjectSaga,
  changeCurrentProject as changeCurrentProjectSaga,
  importGist as importGistSaga,
  importSnapshot as importSnapshotSaga,
  saveCurrentProject,
  toggleLibrary as toggleLibrarySaga,
  userAuthenticated as userAuthenticatedSaga,
  updateProjectSource as updateProjectSourceSaga,
  archiveProject as archiveProjectSaga,
} from '../../../src/sagas/projects';
import {
  gistImportError,
  gistNotFound,
  projectsLoaded,
  toggleLibrary,
  updateProjectInstructions,
  updateProjectSource,
  projectSuccessfullySaved,
  archiveProject,
} from '../../../src/actions/projects';
import {
  snapshotImportError,
  snapshotNotFound,
  projectRestoredFromLastSession,
} from '../../../src/actions/clients';
import {userAuthenticated} from '../../../src/actions/user';
import applicationLoaded from '../../../src/actions/applicationLoaded';
import {loadGistFromId} from '../../../src/clients/github';
import {
  loadAllProjects,
  loadProjectSnapshot,
  saveProject,
} from '../../../src/clients/firebase';
import Scenario from '../../helpers/Scenario';
import {gistData, project, userCredential} from '../../helpers/factory';
import {
  getCurrentUserId,
  getCurrentProject,
  getProject,
} from '../../../src/selectors/index';

test('createProject()', assert => {
  let firstProjectKey;

  const clock = sinon.useFakeTimers();

  testSaga(createProjectSaga)
    .next()
    .inspect(({payload: {action}}) => {
      firstProjectKey = action.payload.projectKey;
      assert.ok(
        firstProjectKey,
        'generator yields PUT action with project key',
      );
    })
    .next()
    .isDone();

  clock.tick(10);

  testSaga(createProjectSaga)
    .next()
    .inspect(({payload: {action}}) => {
      const secondProjectKey = action.payload.projectKey;
      assert.ok(secondProjectKey, 'generator yields action with project key');
      assert.notEqual(
        secondProjectKey,
        firstProjectKey,
        'subsequent calls yield different project keys',
      );
    })
    .next()
    .isDone();

  clock.restore();

  assert.end();
});

test('changeCurrentProject()', assert => {
  const scenario = new Scenario();
  const userId = 'abc123';
  const currentProject = project();
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
  assert.end();
});

test('applicationLoaded()', t => {
  t.test('with no gist or snapshot ID or rehydrated project', assert => {
    testSaga(applicationLoadedSaga, applicationLoaded({gistId: null}))
      .next()
      .call(createProjectSaga)
      .next()
      .isDone();

    assert.end();
  });

  t.test('with snapshot ID', assert => {
    const snapshotKey = '123-abc';
    testSaga(applicationLoadedSaga, applicationLoaded({snapshotKey}))
      .next()
      .call(importSnapshotSaga, applicationLoaded({snapshotKey}))
      .next()
      .isDone();

    assert.end();
  });

  t.test('with gist ID', assert => {
    const gistId = '123abc';
    testSaga(applicationLoadedSaga, applicationLoaded({gistId}))
      .next()
      .call(importGistSaga, applicationLoaded({gistId}))
      .next()
      .isDone();

    assert.end();
  });

  t.test('with rehydrated project', assert => {
    const rehydratedProject = project();
    testSaga(applicationLoadedSaga, applicationLoaded({rehydratedProject}))
      .next()
      .put(projectRestoredFromLastSession(rehydratedProject))
      .next()
      .isDone();

    assert.end();
  });
});

test('importSnapshot()', t => {
  const snapshotKey = 'abc-123';

  t.test('with successful import', assert => {
    const projectData = omit(project(), 'projectKey');
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
          assert.equal(type, 'SNAPSHOT_IMPORTED');
          assert.same(payloadProject, projectData);
          assert.ok(projectKey, 'payload should have a projectKey');
        },
      )
      .next()
      .isDone();

    assert.end();
  });

  t.test('with import error', assert => {
    const error = new Error();
    testSaga(importSnapshotSaga, applicationLoaded({snapshotKey}))
      .next()
      .call(loadProjectSnapshot, snapshotKey)
      .throw(error)
      .put(snapshotImportError(error))
      .next()
      .isDone();

    assert.end();
  });

  t.test('with snapshot not found', assert => {
    testSaga(importSnapshotSaga, applicationLoaded({snapshotKey}))
      .next()
      .call(loadProjectSnapshot, snapshotKey)
      .next(null)
      .put(snapshotNotFound())
      .next()
      .isDone();

    assert.end();
  });
});

test('importGist()', t => {
  const gistId = 'abc123';

  t.test('with successful import', assert => {
    const saga = testSaga(importGistSaga, applicationLoaded({gistId}));

    saga.next().call(loadGistFromId, gistId);

    const gist = gistData({html: '<!doctype html>test'});
    saga.next(gist).inspect(effect => {
      assert.equals(effect.type, 'PUT', 'yielded effect is a PUT');
      assert.equal(
        effect.payload.action.type,
        'GIST_IMPORTED',
        'action is GIST_IMPORTED',
      );
      assert.ok(
        effect.payload.action.payload.projectKey,
        'assigns a project key',
      );
      assert.deepEqual(
        effect.payload.action.payload.gistData,
        gist,
        'includes gist in action payload',
      );
    });

    saga.next().isDone();

    assert.end();
  });

  t.test('with not found error', assert => {
    testSaga(importGistSaga, applicationLoaded({gistId}))
      .next()
      .call(loadGistFromId, gistId)
      .throw(Object.create(new Error(), {response: {value: {status: 404}}}))
      .put(gistNotFound(gistId))
      .next()
      .isDone();
    assert.end();
  });

  t.test('with other error', assert => {
    testSaga(importGistSaga, applicationLoaded({gistId}))
      .next()
      .call(loadGistFromId, gistId)
      .throw(new Error())
      .put(gistImportError())
      .next()
      .isDone();
    assert.end();
  });
});

test('userAuthenticated', assert => {
  const scenario = new Scenario().logIn();
  const projects = [project()];
  const {user, credential} = userCredential();
  testSaga(
    userAuthenticatedSaga,
    userAuthenticated({user, credentials: [credential]}),
  )
    .next()
    .inspect(effect => {
      assert.equals(effect.type, 'SELECT', 'effect type is select');
    })
    .next(scenario.state)
    .fork(saveCurrentProject)
    .next(scenario.state)
    .call(loadAllProjects, scenario.user.account.id)
    .next(projects)
    .put(projectsLoaded(projects))
    .next()
    .isDone();
  assert.end();
});

test('updateProjectSource', assert => {
  const scenario = new Scenario();
  const userId = 'abc123';
  const currentProject = project();
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
  assert.end();
});

test('updateProjectInstructions', assert => {
  const scenario = new Scenario();
  const userId = 'abc123';
  const currentProject = project();
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
  assert.end();
});

test('toggleLibrary', assert => {
  const scenario = new Scenario();
  const userId = 'abc123';
  const currentProject = project();
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
  assert.end();
});

test('archiveProject', assert => {
  const scenario = new Scenario();
  const userId = 'abc123';
  const currentProject = project();
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
  assert.end();
});
