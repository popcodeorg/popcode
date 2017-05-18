import test from 'tape';
import Immutable from 'immutable';
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
} from '../../../src/actions/ui';
import {userLoggedOut} from '../../../src/actions/user';

const initialState = Immutable.fromJS({
  editors: {typing: false, verticalFlex: DEFAULT_VERTICAL_FLEX},
  requestedLine: null,
  notifications: new Immutable.Set(),
  dashboard: {
    isOpen: false,
    activeSubmenu: null,
  },
});

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
  initialState.update(
    'notifications',
    notifications => notifications.add(Immutable.fromJS({
      type: 'gist-import-not-found',
      severity: 'error',
      payload: {gistId},
    })),
  ),
));

test('gistImportError', reducerTest(
  reducer,
  initialState,
  partial(gistImportError, gistId),
  initialState.update(
    'notifications',
    notifications => notifications.add(Immutable.fromJS({
      type: 'gist-import-error',
      severity: 'error',
      payload: {gistId},
    })),
  ),
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
