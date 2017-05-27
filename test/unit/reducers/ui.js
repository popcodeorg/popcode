import test from 'tape';
import Immutable from 'immutable';
import tap from 'lodash/tap';
import partial from 'lodash/partial';
import reducerTest from '../../helpers/reducerTest';
import reducer, {DEFAULT_VERTICAL_FLEX} from '../../../src/reducers/ui';
import {
  gistNotFound,
  gistImportError,
  updateProjectSource,
} from '../../../src/actions/projects';
import {
  editorsUpdateVerticalFlex,
  userDoneTyping,
  focusLine,
  editorFocusedRequestedLine,
} from '../../../src/actions/ui';
import {
  gistExportNotDisplayed,
  gistExportError,
} from '../../../src/actions/clients';
import {EmptyGistError} from '../../../src/clients/gists';
import {userLoggedOut} from '../../../src/actions/user';

const initialState = Immutable.fromJS({
  editors: {
    typing: false,
    requestedFocusedLine: null,
    verticalFlex: DEFAULT_VERTICAL_FLEX,
  },
  notifications: new Immutable.Set(),
  dashboard: {
    isOpen: false,
    activeSubmenu: null,
  },
});

function withNotification(type, severity, payload = {}) {
  return initialState.update(
    'notifications',
    notifications => notifications.add(Immutable.fromJS({
      type,
      severity,
      payload,
    })),
  );
}

const gistId = '12345';

test('editorsUpdateVerticalFlex', (t) => {
  t.test('dragging first divider down', reducerTest(
    reducer,
    initialState,
    partial(editorsUpdateVerticalFlex, {
      deltaY: 5,
      dividerHeights: [
        {minHeight: 4},
        {minHeight: 4},
      ],
      editorHeights: [
        {height: 100, minHeight: 85},
        {height: 100, minHeight: 85},
        {height: 100, minHeight: 85},
      ],
      index: 0,
      lastY: 100,
      y: 105,
    }),
    initialState.setIn(
      ['editors', 'verticalFlex'],
      new Immutable.List(['0 1 105px', '1', '0 1 100px']),
    ),
  ));
  t.test('dragging second divider down', reducerTest(
    reducer,
    initialState,
    partial(editorsUpdateVerticalFlex, {
      deltaY: 5,
      dividerHeights: [
        {minHeight: 4},
        {minHeight: 4},
      ],
      editorHeights: [
        {height: 100, minHeight: 85},
        {height: 100, minHeight: 85},
        {height: 100, minHeight: 85},
      ],
      index: 1,
      lastY: 204,
      y: 209,
    }),
    initialState.setIn(
      ['editors', 'verticalFlex'],
      new Immutable.List(['0 1 100px', '0 1 105px', '1']),
    ),
  ));
});

test('gistNotFound', reducerTest(
  reducer,
  initialState,
  partial(gistNotFound, gistId),
  withNotification('gist-import-not-found', 'error', {gistId}),
));

test('gistImportError', reducerTest(
  reducer,
  initialState,
  partial(gistImportError, gistId),
  withNotification('gist-import-error', 'error', {gistId}),
));

test('updateProjectSource', reducerTest(
  reducer,
  initialState,
  updateProjectSource,
  initialState.setIn(['editors', 'typing'], true),
));

test('userDoneTyping', reducerTest(
  reducer,
  initialState.setIn(['editors', 'typing'], true),
  userDoneTyping,
  initialState,
));

test('userLoggedOut', (t) => {
  const libraryPickerOpen = initialState.setIn(
    ['dashboard', 'activeSubmenu'],
    'libraryPicker',
  );
  t.test('with active submenu that is not projects', reducerTest(
    reducer,
    libraryPickerOpen,
    userLoggedOut,
    libraryPickerOpen,
  ));

  t.test('with projectList active submenu', reducerTest(
    reducer,
    initialState.setIn(
      ['dashboard', 'activeSubmenu'],
      'projectList',
    ),
    userLoggedOut,
    initialState,
  ));
});

tap('https://gists.github.com/12345abc', (url) => {
  test('gistExportNotDisplayed', reducerTest(
    reducer,
    initialState,
    partial(gistExportNotDisplayed, url),
    withNotification('gist-export-complete', 'notice', {url}),
  ));
});

test('gistExportError', (t) => {
  t.test('with generic error', reducerTest(
    reducer,
    initialState,
    partial(gistExportError, new Error()),
    withNotification('gist-export-error', 'error'),
  ));

  t.test('with generic error', reducerTest(
    reducer,
    initialState,
    partial(gistExportError, new EmptyGistError()),
    withNotification('empty-gist', 'error'),
  ));
});

test('focusLine', reducerTest(
  reducer,
  initialState,
  partial(focusLine, 'javascript', 4, 2),
  initialState.setIn(
    ['editors', 'requestedFocusedLine'],
    new Immutable.Map({language: 'javascript', line: 4, column: 2}),
  ),
));

test('editorFocusedRequestedLine', reducerTest(
  reducer,
  initialState.setIn(
    ['editors', 'requestedFocusedLine'],
    new Immutable.Map({language: 'javascript', line: 4, column: 2}),
  ),
  editorFocusedRequestedLine,
  initialState,
));
