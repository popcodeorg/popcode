import test from 'tape';
import {testSaga} from 'redux-saga-test-plan';
import {
  userDoneTyping as userDoneTypingSaga,
  exportGist as exportGistSaga,
} from '../../../src/sagas/ui';
import {userDoneTyping} from '../../../src/actions/ui';
import {
  gistExported,
  gistExportDisplayed,
  gistExportError,
  gistExportNotDisplayed,
} from '../../../src/actions/clients';
import {openWindowWithWorkaroundForChromeClosingBug} from '../../../src/util';
import {spinnerPage} from '../../../src/templates';

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
      next().call(
        openWindowWithWorkaroundForChromeClosingBug,
        `data:text/html;base64,${spinnerPage}`,
      ).
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
      next().call(
        openWindowWithWorkaroundForChromeClosingBug,
        `data:text/html;base64,${spinnerPage}`,
      ).
      next(mockWindow).take(['GIST_EXPORTED', 'GIST_EXPORT_ERROR']).
      next(gistExported(url)).put(gistExportNotDisplayed(url)).
      next().isDone();

    assert.notOk(mockWindow.location.href);

    assert.end();
  });

  t.test('with gist export error', (assert) => {
    const mockWindow = {closed: false, close() { }};
    testSaga(exportGistSaga).
      next().call(
        openWindowWithWorkaroundForChromeClosingBug,
        `data:text/html;base64,${spinnerPage}`,
      ).
      next(mockWindow).take(['GIST_EXPORTED', 'GIST_EXPORT_ERROR']).
      next(gistExportError(new Error())).call([mockWindow, 'close']).
      next().isDone();

    assert.end();
  });
});
