import noop from 'lodash-es/noop';

import {testSaga} from 'redux-saga-test-plan';
import {
  exportProject as exportProjectSaga,
  popOutProject as popOutProjectSaga,
  userDoneTyping as userDoneTypingSaga,
} from '../ui';
import {getCurrentProject} from '../../selectors';
import {popOutProject, userDoneTyping} from '../../actions/ui';
import {
  projectExportDisplayed,
  projectExported,
  projectExportError,
  projectExportNotDisplayed,
} from '../../actions/clients';
import {openWindowWithContent} from '../../util';
import spinnerPageHtml from '../../../templates/project-export.html';
import compileProject from '../../util/compileProject';

test('userDoneTyping', () => {
  testSaga(userDoneTypingSaga).next().put(userDoneTyping()).next().isDone();
});

describe('exportProject', () => {
  test('with window still open', () => {
    const mockWindow = {closed: false, location: {}};
    const url = 'https://gist.github.com/abc123';
    const exportType = 'gist';
    testSaga(exportProjectSaga)
      .next()
      .call(openWindowWithContent, spinnerPageHtml)
      .next(mockWindow)
      .take(['PROJECT_EXPORTED', 'PROJECT_EXPORT_ERROR'])
      .next(projectExported(url, exportType))
      .put(projectExportDisplayed())
      .next()
      .isDone();

    expect(mockWindow.location.href).toEqual(url);
  });

  test('with window closed', () => {
    const mockWindow = {closed: true, location: {}};
    const url = 'https://gist.github.com/abc123';
    const exportType = 'gist';
    testSaga(exportProjectSaga)
      .next()
      .call(openWindowWithContent, spinnerPageHtml)
      .next(mockWindow)
      .take(['PROJECT_EXPORTED', 'PROJECT_EXPORT_ERROR'])
      .next(projectExported(url, exportType))
      .put(projectExportNotDisplayed(url, exportType))
      .next()
      .isDone();

    expect(mockWindow.location.href).toBeFalsy();
  });

  test('with project export error', () => {
    const mockWindow = {closed: false, close: noop};
    const exportType = 'gist';
    testSaga(exportProjectSaga)
      .next()
      .call(openWindowWithContent, spinnerPageHtml)
      .next(mockWindow)
      .take(['PROJECT_EXPORTED', 'PROJECT_EXPORT_ERROR'])
      .next(projectExportError(exportType))
      .call([mockWindow, 'close'])
      .next()
      .isDone();
  });
});

test('popOutProject', () => {
  const mockWindow = {closed: false, close: noop};
  const project = {};
  const preview = {src: '<html></html>'};
  testSaga(popOutProjectSaga, popOutProject())
    .next()
    .select(getCurrentProject)
    .next(project)
    .call(compileProject, project)
    .next({source: preview})
    .call(openWindowWithContent, preview)
    .next(mockWindow)
    .isDone();
});
