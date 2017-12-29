import Immutable from 'immutable';
import {
  updateEditorColumnFlex,
  updateWorkspaceRowFlex,
  updateOutputColumnFlex,
} from '../util/resize';


const DEFAULT_COLUMN_FLEX = new Immutable.List(['1', '1', '1']);
const DEFAULT_ROW_FLEX = new Immutable.List(['1', '1']);
const DEFAULT_OUTPUT_COLUMN_FLEX = new Immutable.List(['1', '1']);

export const DEFAULT_WORKSPACE = new Immutable.Map({
  editors: new Immutable.Map({
    flex: DEFAULT_COLUMN_FLEX,
    isDraggingDivider: false,
    refs: new Immutable.List(),
  }),
  columns: new Immutable.Map({
    flex: DEFAULT_ROW_FLEX,
    isDraggingDivider: false,
    refs: new Immutable.List(),
    dividerRefs: new Immutable.List(),
  }),
  output: new Immutable.Map({
    flex: DEFAULT_OUTPUT_COLUMN_FLEX,
    isDraggingDivider: false,
    refs: new Immutable.List(),
    dividerRefs: new Immutable.List(),
  }),

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
export default function ui(stateIn, action) {
  let state = stateIn;
  if (state === undefined) {
    state = defaultState;
  }

  switch (action.type) {
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
      if (action.payload.componentName === 'output') {
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
          set('language', action.payload.language).
          set('line', action.payload.line).
          set('column', action.payload.column),
      );

    case 'EDITOR_FOCUSED_REQUESTED_LINE':
      return state.setIn(['editors', 'requestedFocusedLine'], null);

    case 'DRAG_DIVIDER':
      return state.updateIn(['workspace', action.payload.section, 'flex'],
        (prevFlex) => {
          let newFlex;
          if (action.payload.section === 'editors') {
            newFlex = updateEditorColumnFlex(action.payload.data);
          } else if (action.payload.section === 'columns') {
            newFlex = updateWorkspaceRowFlex(action.payload.data);
          } else if (action.payload.section === 'output') {
            newFlex = updateOutputColumnFlex(action.payload.data);
          }
          return newFlex ? Immutable.fromJS(newFlex) : prevFlex;
        },
      );

    case 'START_DRAG_DIVIDER':
      return state.setIn([
        'workspace',
        action.payload,
        'isDraggingDivider',
      ],
      true,
      );

    case 'STOP_DRAG_DIVIDER':
      return state.setIn([
        'workspace',
        action.payload,
        'isDraggingDivider',
      ],
      false,
      );

    case 'STORE_RESIZABLE_SECTION_REF':
      return state.setIn([
        'workspace',
        action.payload.section,
        'refs',
        action.payload.index,
      ],
      action.payload.ref,
      );

    case 'STORE_DIVIDER_REF':
      return state.setIn([
        'workspace',
        action.payload.section,
        'dividerRefs',
        action.payload.index,
      ],
      action.payload.ref,
      );

    case 'GIST_NOT_FOUND':
      return addNotification(
        state,
        'gist-import-not-found',
        'error',
        {gistId: action.payload.gistId},
      );

    case 'GIST_IMPORT_ERROR':
      return addNotification(
        state,
        'gist-import-error',
        'error',
        {gistId: action.payload.gistId},
      );

    case 'NOTIFICATION_TRIGGERED':
      return addNotification(
        state,
        action.payload.type,
        action.payload.severity,
        action.payload.payload,
      );

    case 'USER_DISMISSED_NOTIFICATION':
      return dismissNotification(state, action.payload.type);

    case 'UPDATE_NOTIFICATION_METADATA':
      return state.setIn(
        ['notifications', action.payload.type, 'metadata'],
        Immutable.fromJS(action.payload.metadata),
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
        {snapshotKey: action.payload},
      );

    case 'APPLICATION_LOADED':
      if (action.payload.isExperimental) {
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
        menu => menu === action.payload ? null : action.payload,
      );

    case 'CLOSE_TOP_BAR_MENU':
      return state.updateIn(
        ['topBar', 'openMenu'],
        menu => menu === action.payload ? null : menu,
      );

    case 'PROJECT_EXPORT_NOT_DISPLAYED':
      return addNotification(
        state,
        'project-export-complete',
        'notice',
        action.payload,
      );

    case 'PROJECT_EXPORT_ERROR':
      if (action.payload.name === 'EmptyGistError') {
        return addNotification(
          state,
          'empty-gist',
          'error',
        );
      }
      return addNotification(
        state,
        `${action.payload.exportType}-export-error`,
        'error',
        action.payload,
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
