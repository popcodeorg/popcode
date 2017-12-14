import test from 'tape';
import {testSaga} from 'redux-saga-test-plan';
import {
  userDoneTyping as userDoneTypingSaga,
  exportGist as exportGistSaga,
  popOutProject as popOutProjectSaga,
  exportRepo as exportRepoSaga,
} from '../../../src/sagas/ui';
import {getCurrentProject} from '../../../src/selectors';
import {userDoneTyping, popOutProject} from '../../../src/actions/ui';
import {
  gistExported,
  gistExportDisplayed,
  gistExportError,
  gistExportNotDisplayed,
  repoExported,
  repoExportDisplayed,
  repoExportError,
  repoExportNotDisplayed,
} from '../../../src/actions/clients';
import {openWindowWithContent} from '../../../src/util';
import spinnerPageHtml from '../../../templates/github-export.html';
import compileProject from '../../../src/util/compileProject';

test('userDoneTyping', (assert) => {
  testSaga(userDoneTypingSaga).
    next().put(userDoneTyping()).
    next().isDone();

  assert.end();
});

test('exportGist', (t) => {
  t.test('with window still open', (assert) => {
    const mockWindow = {closed: false, location: {}};
    const url = 'https://gist.github.com/abc123';
    testSaga(exportGistSaga).
      next().call(openWindowWithContent, spinnerPageHtml).
      next(mockWindow).take(['GIST_EXPORTED', 'GIST_EXPORT_ERROR']).
      next(gistExported(url)).put(gistExportDisplayed()).
      next().isDone();

    assert.equal(mockWindow.location.href, url);

    assert.end();
  });

  t.test('with window closed', (assert) => {
    const mockWindow = {closed: true, location: {}};
    const url = 'https://gist.github.com/abc123';
    testSaga(exportGistSaga).
      next().call(openWindowWithContent, spinnerPageHtml).
      next(mockWindow).take(['GIST_EXPORTED', 'GIST_EXPORT_ERROR']).
      next(gistExported(url)).put(gistExportNotDisplayed(url)).
      next().isDone();

    assert.notOk(mockWindow.location.href);

    assert.end();
  });

  t.test('with gist export error', (assert) => {
    const mockWindow = {closed: false, close() { }};
    testSaga(exportGistSaga).
      next().call(openWindowWithContent, spinnerPageHtml).
      next(mockWindow).take(['GIST_EXPORTED', 'GIST_EXPORT_ERROR']).
      next(gistExportError(new Error())).call([mockWindow, 'close']).
      next().isDone();

    assert.end();
  });
});


test('popOutProject', (assert) => {
  const mockWindow = {closed: false, close() { }};
  const project = {};
  const preview = {src: '<html></html>'};
  testSaga(popOutProjectSaga, popOutProject()).
    next().select(getCurrentProject).
    next(project).call(compileProject, project).
    next({source: preview}).call(openWindowWithContent, preview).
    next(mockWindow).isDone();
  assert.end();
});

test('exportRepo', (t) => {
  t.test('with window still open', (assert) => {
    const mockWindow = {closed: false, location: {}};
    const url = 'https://popcode-mat.github.io/my-popcode-repo';
    testSaga(exportRepoSaga).
      next().call(openWindowWithContent, spinnerPageHtml).
      next(mockWindow).take(['REPO_EXPORTED', 'REPO_EXPORT_ERROR']).
      next(repoExported(url)).put(repoExportDisplayed()).
      next().isDone();

    assert.equal(mockWindow.location.href, url);

    assert.end();
  });

  t.test('with window closed', (assert) => {
    const mockWindow = {closed: true, location: {}};
    const url = 'https://popcode-mat.github.io/my-popcode-repo';
    testSaga(exportRepoSaga).
      next().call(openWindowWithContent, spinnerPageHtml).
      next(mockWindow).take(['REPO_EXPORTED', 'REPO_EXPORT_ERROR']).
      next(repoExported(url)).put(repoExportNotDisplayed(url)).
      next().isDone();

    assert.notOk(mockWindow.location.href);

    assert.end();
  });

  t.test('with repo export error', (assert) => {
    const mockWindow = {closed: false, close() { }};
    testSaga(exportRepoSaga).
      next().call(openWindowWithContent, spinnerPageHtml).
      next(mockWindow).take(['REPO_EXPORTED', 'REPO_EXPORT_ERROR']).
      next(repoExportError(new Error())).call([mockWindow, 'close']).
      next().isDone();

    assert.end();
  });
});
