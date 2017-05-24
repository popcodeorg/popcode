import test from 'tape';
import {testSaga} from 'redux-saga-test-plan';
import {
  exportGist as exportGistSaga,
} from '../../../src/sagas/clients';
import {gistExported, gistExportError} from '../../../src/actions/clients';
import Scenario from '../../helpers/Scenario';
import {createFromProject} from '../../../src/clients/gists';

test('exportGist()', (t) => {
  const url = 'https://gist.github.com/abc123';
  const scenario = new Scenario();
  scenario.logIn();

  function initiateExport(assert) {
    return testSaga(exportGistSaga).
      next().inspect((effect) => {
        assert.ok(effect.SELECT, 'invokes select effect');
      }).
      next(scenario.state).call(
        createFromProject,
        scenario.project.toJS(),
        scenario.user.toJS(),
      );
  }

  t.test('with successful export', (assert) => {
    initiateExport(assert).
      next({html_url: url}).put(gistExported(url)).
      next().isDone();
    assert.end();
  });

  t.test('with error', (assert) => {
    const error = new Error();
    initiateExport(assert).
      throw(error).put(gistExportError(error)).
      next().isDone();
    assert.end();
  });
});
