import 'jest-date-mock';
import {testSaga} from 'redux-saga-test-plan';
import {
  createSnapshot as createSnapshotSaga,
  exportProject as exportProjectSaga,
} from '../clients';
import {
  projectExported,
  projectExportError,
  snapshotCreated,
  snapshotExportError,
} from '../../actions/clients';
import {deprecated_Scenario as Scenario} from './migratedKarmaTestHelpers';
import {
  createGistFromProject,
  createOrUpdateRepoFromProject,
} from '../../clients/github';
import {createProjectSnapshot} from '../../clients/firebase';
import {createShareToClassroomUrl} from '../../clients/googleClassroom';
import {getCurrentProject} from '../../selectors';
import {generateTextPreview} from '../../util/compileProject';

describe('createSnapshot()', () => {
  const {project} = new Scenario();
  const key = '123-456';

  function initiateSnapshot() {
    return testSaga(createSnapshotSaga)
      .next()
      .select(getCurrentProject)
      .next(project.toJS())
      .call(createProjectSnapshot, project.toJS());
  }

  test('successful export', () => {
    initiateSnapshot().next(key).put(snapshotCreated(key)).next().isDone();
  });

  test('error', () => {
    const error = new Error();
    initiateSnapshot()
      .throw(error)
      .put(snapshotExportError(error))
      .next()
      .isDone();
  });
});

describe('export gist', () => {
  const url = 'https://gist.github.com/abc123';
  const exportType = 'gist';
  const scenario = new Scenario();
  scenario.logIn();
  scenario.authGitHub();

  function initiateExport() {
    return testSaga(exportProjectSaga, {payload: {exportType}})
      .next()
      .inspect(effect => {
        expect(effect.type).toEqual('SELECT');
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

  test('with successful export', () => {
    initiateExport()
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
  });

  test('with error', () => {
    const error = new Error();
    initiateExport()
      .throw(error)
      .put(projectExportError(exportType))
      .next()
      .isDone();
  });
});

describe('export repo', () => {
  const name = 'Page-Title-abc123';
  const url = `https://github.com/usernmaer/${name}`;
  const exportType = 'repo';
  const scenario = new Scenario();
  scenario.logIn();
  scenario.authGitHub();

  function initiateExport() {
    return testSaga(exportProjectSaga, {payload: {exportType}})
      .next()
      .inspect(effect => {
        expect(effect.type).toEqual('SELECT');
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

  test('with successful export', () => {
    initiateExport()
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
  });

  test('with error', () => {
    const error = new Error();
    initiateExport()
      .throw(error)
      .put(projectExportError(exportType))
      .next()
      .isDone();
  });
});

describe('update repo', () => {
  const url = 'https://github.com/usernmaer/Page-Title-abc123';
  const exportType = 'repo';
  const scenario = new Scenario();
  scenario.logIn();
  scenario.authGitHub();

  function initiateExport() {
    return testSaga(exportProjectSaga, {payload: {exportType}})
      .next()
      .inspect(effect => {
        expect(effect.type).toEqual('SELECT');
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

  test('with successful export', () => {
    initiateExport()
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
  });

  test('with error', () => {
    const error = new Error();
    initiateExport()
      .throw(error)
      .put(projectExportError(exportType))
      .next()
      .isDone();
  });
});

describe('export to classroom', () => {
  const url = 'https://classroom.google.com/u/0/share?url=http://popcode.org';
  const exportType = 'classroom';
  const snapshotKey = '123-456';
  const projectTitle = 'Page Title';
  const scenario = new Scenario();
  scenario.logIn();

  function initiateExport() {
    return testSaga(exportProjectSaga, {payload: {exportType}})
      .next()
      .inspect(effect => {
        expect(effect.type).toEqual('SELECT');
      })
      .next(scenario.state)
      .call(createProjectSnapshot, scenario.project.toJS())
      .next(snapshotKey)
      .call(generateTextPreview, scenario.project.toJS())
      .next(projectTitle)
      .call(createShareToClassroomUrl, snapshotKey, projectTitle);
  }

  test('with successful export', () => {
    initiateExport()
      .next(url)
      .put(projectExported(url, exportType, scenario.project.projectKey, {}))
      .next()
      .isDone();
  });

  test('with error', () => {
    const error = new Error();
    initiateExport()
      .throw(error)
      .put(projectExportError(exportType))
      .next()
      .isDone();
  });
});
