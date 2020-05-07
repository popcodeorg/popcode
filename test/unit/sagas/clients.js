import test from 'tape-catch';
import {testSaga} from 'redux-saga-test-plan';
import {
  createSnapshot as createSnapshotSaga,
  exportProject as exportProjectSaga,
} from '../../../src/sagas/clients';
import {
  projectExported,
  projectExportError,
  snapshotCreated,
  snapshotExportError,
} from '../../../src/actions/clients';
import Scenario from '../../helpers/Scenario';
import {
  createGistFromProject,
  createOrUpdateRepoFromProject,
} from '../../../src/clients/github';
import {createProjectSnapshot} from '../../../src/clients/firebase';
import {createShareToClassroomUrl} from '../../../src/clients/googleClassroom';
import {getCurrentProject} from '../../../src/selectors';
import {generateTextPreview} from '../../../src/util/compileProject';

test('createSnapshot()', t => {
  const {project} = new Scenario();
  const key = '123-456';

  function initiateSnapshot() {
    return testSaga(createSnapshotSaga)
      .next()
      .select(getCurrentProject)
      .next(project.toJS())
      .call(createProjectSnapshot, project.toJS());
  }

  t.test('successful export', assert => {
    initiateSnapshot().next(key).put(snapshotCreated(key)).next().isDone();

    assert.end();
  });

  t.test('error', assert => {
    const error = new Error();
    initiateSnapshot()
      .throw(error)
      .put(snapshotExportError(error))
      .next()
      .isDone();

    assert.end();
  });
});

test('export gist', t => {
  const url = 'https://gist.github.com/abc123';
  const exportType = 'gist';
  const scenario = new Scenario();
  scenario.logIn();
  scenario.authGitHub();

  function initiateExport(assert) {
    return testSaga(exportProjectSaga, {payload: {exportType}})
      .next()
      .inspect(effect => {
        assert.equals(effect.type, 'SELECT', 'invokes select effect');
      })
      .next(scenario.state)
      .call(
        createGistFromProject,
        scenario.project.toJS(),
        scenario.user.account.getIn([
          'identityProviders',
          'github.com',
          'accessToken',
        ]),
      );
  }

  t.test('with successful export', assert => {
    const clock = sinon.useFakeTimers();
    initiateExport(assert)
      .next({html_url: url})
      .put(
        projectExported(
          url,
          exportType,
          scenario.project.projectKey,
          {},
          Date.now(),
        ),
      )
      .next()
      .isDone();
    clock.restore();
    assert.end();
  });

  t.test('with error', assert => {
    const error = new Error();
    initiateExport(assert)
      .throw(error)
      .put(projectExportError(exportType))
      .next()
      .isDone();
    assert.end();
  });
});

test('export repo', t => {
  const name = 'Page-Title-abc123';
  const url = `https://github.com/usernmaer/${name}`;
  const exportType = 'repo';
  const scenario = new Scenario();
  scenario.logIn();
  scenario.authGitHub();

  function initiateExport(assert) {
    return testSaga(exportProjectSaga, {payload: {exportType}})
      .next()
      .inspect(effect => {
        assert.equals(effect.type, 'SELECT', 'invokes select effect');
      })
      .next(scenario.state)
      .call(
        createOrUpdateRepoFromProject,
        scenario.project.toJS(),
        scenario.user.account.getIn([
          'identityProviders',
          'github.com',
          'accessToken',
        ]),
      );
  }

  t.test('with successful export', assert => {
    const clock = sinon.useFakeTimers();
    initiateExport(assert)
      .next({url, name})
      .put(
        projectExported(
          url,
          exportType,
          scenario.project.projectKey,
          {name},
          Date.now(),
        ),
      )
      .next()
      .isDone();
    clock.restore();
    assert.end();
  });

  t.test('with error', assert => {
    const error = new Error();
    initiateExport(assert)
      .throw(error)
      .put(projectExportError(exportType))
      .next()
      .isDone();
    assert.end();
  });
});

test('update repo', t => {
  const url = 'https://github.com/usernmaer/Page-Title-abc123';
  const exportType = 'repo';
  const scenario = new Scenario();
  scenario.logIn();
  scenario.authGitHub();

  function initiateExport(assert) {
    return testSaga(exportProjectSaga, {payload: {exportType}})
      .next()
      .inspect(effect => {
        assert.equals(effect.type, 'SELECT', 'invokes select effect');
      })
      .next(scenario.state)
      .call(
        createOrUpdateRepoFromProject,
        scenario.project.toJS(),
        scenario.user.account.getIn([
          'identityProviders',
          'github.com',
          'accessToken',
        ]),
      );
  }

  t.test('with successful export', assert => {
    const clock = sinon.useFakeTimers();
    initiateExport(assert)
      .next({url})
      .put(
        projectExported(
          url,
          exportType,
          scenario.project.projectKey,
          {},
          Date.now(),
        ),
      )
      .next()
      .isDone();
    clock.restore();
    assert.end();
  });

  t.test('with error', assert => {
    const error = new Error();
    initiateExport(assert)
      .throw(error)
      .put(projectExportError(exportType))
      .next()
      .isDone();
    assert.end();
  });
});

test('export to classroom', t => {
  const url = 'https://classroom.google.com/u/0/share?url=http://popcode.org';
  const exportType = 'classroom';
  const snapshotKey = '123-456';
  const projectTitle = 'Page Title';
  const scenario = new Scenario();
  scenario.logIn();

  function initiateExport(assert) {
    return testSaga(exportProjectSaga, {payload: {exportType}})
      .next()
      .inspect(effect => {
        assert.equals(effect.type, 'SELECT', 'invokes select effect');
      })
      .next(scenario.state)
      .call(createProjectSnapshot, scenario.project.toJS())
      .next(snapshotKey)
      .call(generateTextPreview, scenario.project.toJS())
      .next(projectTitle)
      .call(createShareToClassroomUrl, snapshotKey, projectTitle);
  }

  t.test('with successful export', assert => {
    const clock = sinon.useFakeTimers();
    initiateExport(assert)
      .next(url)
      .put(projectExported(url, exportType, scenario.project.projectKey, {}))
      .next()
      .isDone();
    clock.restore();
    assert.end();
  });

  t.test('with error', assert => {
    const error = new Error();
    initiateExport(assert)
      .throw(error)
      .put(projectExportError(exportType))
      .next()
      .isDone();
    assert.end();
  });
});
