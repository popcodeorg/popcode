import Immutable from 'immutable';
import {
  updateEditorColumnFlex,
  updateWorkspaceRowFlex,
} from '../util/resize';


const DEFAULT_COLUMN_FLEX = new Immutable.List(['1', '1', '1']);
const DEFAULT_ROW_FLEX = new Immutable.List(['1', '1']);
export const DEFAULT_WORKSPACE = new Immutable.Map({
  columnFlex: DEFAULT_COLUMN_FLEX,
  rowFlex: DEFAULT_ROW_FLEX,
  isDraggingColumnDivider: false,
});

const defaultState = new Immutable.Map().
  set('editors', new Immutable.Map({
    typing: false,
    requestedFocusedLine: null,
    textSizeIsLarge: false,
  })).
  set('workspace', DEFAULT_WORKSPACE).
  set('notifications', new Immutable.Map()).
  set('topBar', new Immutable.Map({openMenu: null}));

function addNotification(state, type, severity, payload = {}) {
  return state.setIn(
    ['notifications', type],
    Immutable.fromJS({type, severity, payload, metadata: {}}),
  );
}

function dismissNotification(state, type) {
  return state.update(
    'notifications',
    notifications => notifications.delete(type),
  );
}

/* eslint-disable complexity */
export default function ui(stateIn, {type, payload}) {
  let state = stateIn;
  if (state === undefined) {
    state = defaultState;
  }

  switch (type) {
    case 'CHANGE_CURRENT_PROJECT':
      return state.
        set('workspace', DEFAULT_WORKSPACE).
        updateIn(
          ['topBar', 'openMenu'],
          menu => menu === 'projectPicker' ? null : menu,
        );

    case 'PROJECT_CREATED':
      return state.set('workspace', DEFAULT_WORKSPACE);

    case 'HIDE_COMPONENT':
    case 'UNHIDE_COMPONENT':
      if (payload.componentName === 'output') {
        return state.setIn(['workspace', 'rowFlex'], DEFAULT_ROW_FLEX);
      }
      return state.setIn(['workspace', 'columnFlex'], DEFAULT_COLUMN_FLEX);

    case 'UPDATE_PROJECT_SOURCE':
      return state.setIn(['editors', 'typing'], true);

    case 'USER_DONE_TYPING':
      return state.setIn(['editors', 'typing'], false);

    case 'FOCUS_LINE':
      return state.setIn(
        ['editors', 'requestedFocusedLine'],
        new Immutable.Map().
          set('component', payload.component).
          set('line', payload.line).
          set('column', payload.column),
      );

    case 'CLEAR_CONSOLE_ENTRIES':
      return state.setIn(
        ['editors', 'requestedFocusedLine'],
        new Immutable.Map().
          set('component', 'console').
          set('line', 0).
          set('column', 0),
      );

    case 'EDITOR_FOCUSED_REQUESTED_LINE':
      return state.setIn(['editors', 'requestedFocusedLine'], null);

    case 'DRAG_ROW_DIVIDER':
      return state.updateIn(['workspace', 'columnFlex'], (prevFlex) => {
        const newFlex = updateEditorColumnFlex(payload);
        return newFlex ? Immutable.fromJS(newFlex) : prevFlex;
      });

    case 'DRAG_COLUMN_DIVIDER':
      return state.updateIn(['workspace', 'rowFlex'], (prevFlex) => {
        const newFlex = updateWorkspaceRowFlex(payload);
        return newFlex ? Immutable.fromJS(newFlex) : prevFlex;
      });

    case 'START_DRAG_COLUMN_DIVIDER':
      return state.setIn(['workspace', 'isDraggingColumnDivider'], true);

    case 'STOP_DRAG_COLUMN_DIVIDER':
      return state.setIn(['workspace', 'isDraggingColumnDivider'], false);

    case 'GIST_NOT_FOUND':
      return addNotification(
        state,
        'gist-import-not-found',
        'error',
        {gistId: payload.gistId},
      );

    case 'GIST_IMPORT_ERROR':
      return addNotification(
        state,
        'gist-import-error',
        'error',
        {gistId: payload.gistId},
      );

    case 'NOTIFICATION_TRIGGERED':
      return addNotification(
        state,
        payload.type,
        payload.severity,
        payload.payload,
      );

    case 'USER_DISMISSED_NOTIFICATION':
      return dismissNotification(state, payload.type);

    case 'UPDATE_NOTIFICATION_METADATA':
      return state.setIn(
        ['notifications', payload.type, 'metadata'],
        Immutable.fromJS(payload.metadata),
      );

    case 'USER_LOGGED_OUT':
      return state.updateIn(
        ['topBar', 'openMenu'],
        menu => menu === 'currentUser' ? null : menu,
      );

    case 'SNAPSHOT_CREATED':
      return addNotification(
        state,
        'snapshot-created',
        'notice',
        {snapshotKey: payload},
      );

    case 'APPLICATION_LOADED':
      if (payload.isExperimental) {
        return state.set('experimental', true);
      }
      return state.set('experimental', false);

    case 'SNAPSHOT_EXPORT_ERROR':
      return addNotification(state, 'snapshot-export-error', 'error');

    case 'SNAPSHOT_IMPORT_ERROR':
      return addNotification(state, 'snapshot-import-error', 'error');

    case 'SNAPSHOT_NOT_FOUND':
      return addNotification(state, 'snapshot-not-found', 'error');

    case 'TOGGLE_EDITOR_TEXT_SIZE':
      return state.updateIn(['editors', 'textSizeIsLarge'],
        textSizeIsLarge => !textSizeIsLarge,
      );

    case 'TOGGLE_TOP_BAR_MENU':
      return state.updateIn(
        ['topBar', 'openMenu'],
        menu => menu === payload ? null : payload,
      );

    case 'CLOSE_TOP_BAR_MENU':
      return state.updateIn(
        ['topBar', 'openMenu'],
        menu => menu === payload ? null : menu,
      );

    case 'PROJECT_EXPORT_NOT_DISPLAYED':
      return addNotification(
        state,
        'project-export-complete',
        'notice',
        payload,
      );

    case 'PROJECT_EXPORT_ERROR':
      if (payload.name === 'EmptyGistError') {
        return addNotification(
          state,
          'empty-gist',
          'error',
        );
      }
      return addNotification(
        state,
        `${payload.exportType}-export-error`,
        'error',
        payload,
      );

    case 'PROJECT_COMPILATION_FAILED':
      return addNotification(
        state,
        'project-compilation-failed',
        'error',
      );

    case 'PROJECT_COMPILED':
      return dismissNotification(state, 'project-compilation-failed');

    default:
      return state;
  }
}
