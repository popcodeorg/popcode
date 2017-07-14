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
    enlargedEditors: new Immutable.Set(),
  })).
  set('workspace', DEFAULT_WORKSPACE).
  set('notifications', new Immutable.Set()).
  set(
    'dashboard',
    new Immutable.Map().
      set('isOpen', false).
      set('activeSubmenu', null),
  ).
  set('lastRefreshTimestamp', null);

function addNotification(state, type, severity, payload = {}) {
  return state.update('notifications', notifications =>
    notifications.add(
      new Immutable.Map().
        set('type', type).
        set('severity', severity).
        set('payload', Immutable.fromJS(payload)),
    ),
  );
}

export default function ui(stateIn, action) {
  let state = stateIn;
  if (state === undefined) {
    state = defaultState;
  }

  switch (action.type) {
    case 'CHANGE_CURRENT_PROJECT':
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

    case 'DASHBOARD_TOGGLED':
      return state.updateIn(['dashboard', 'isOpen'], isOpen => !isOpen).
        setIn(['dashboard', 'activeSubmenu'], null);

    case 'DASHBOARD_SUBMENU_TOGGLED':
      return state.updateIn(['dashboard', 'activeSubmenu'], (submenu) => {
        const newSubmenu = action.payload.submenu;
        if (submenu === newSubmenu) {
          return null;
        }

        return newSubmenu;
      });

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

    case 'DRAG_ROW_DIVIDER':
      return state.updateIn(['workspace', 'columnFlex'], (prevFlex) => {
        const newFlex = updateEditorColumnFlex(action.payload);
        return newFlex ? Immutable.fromJS(newFlex) : prevFlex;
      });

    case 'DRAG_COLUMN_DIVIDER':
      return state.updateIn(['workspace', 'rowFlex'], (prevFlex) => {
        const newFlex = updateWorkspaceRowFlex(action.payload);
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
      return state.update(
        'notifications',
        errors => errors.filterNot(
          error => error.get('type') === action.payload.type,
        ),
      );

    case 'USER_LOGGED_OUT':
      if (state.getIn(['dashboard', 'activeSubmenu']) === 'projectList') {
        return state.setIn(
          ['dashboard', 'activeSubmenu'],
          null,
        );
      }
      return state;

    case 'GIST_EXPORT_NOT_DISPLAYED':
      return addNotification(
        state,
        'gist-export-complete',
        'notice',
        {url: action.payload},
      );

    case 'GIST_EXPORT_ERROR':
      if (action.payload.name === 'EmptyGistError') {
        return addNotification(state, 'empty-gist', 'error');
      }
      return addNotification(state, 'gist-export-error', 'error');

    case 'REFRESH_PREVIEW':
      return state.set('lastRefreshTimestamp', action.payload.timestamp);

    case 'APPLICATION_LOADED':
      if (action.payload.isExperimental) {
        return state.set('experimental', true);
      }
      return state.set('experimental', false);

    case 'TOGGLE_EDITOR_TEXT_SIZE':
      return state.updateIn(
        ['editors', 'enlargedEditors'],
        (enlargedEditors) => {
          const componentName = action.payload.componentName;
          if (enlargedEditors.has(componentName)) {
            return enlargedEditors.delete(componentName);
          }
          return enlargedEditors.add(componentName);
        },
      );

    default:
      return state;
  }
}
