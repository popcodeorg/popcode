import Immutable from 'immutable';
import pick from 'lodash/pick';
import {updateVerticalFlex} from '../util/resize';

export const DEFAULT_VERTICAL_FLEX = new Immutable.List(['1', '1', '1']);

const defaultState = new Immutable.Map().
  set('editors', new Immutable.Map({
    typing: false,
    verticalFlex: DEFAULT_VERTICAL_FLEX,
    requestedFocusedLine: null,
  })).
  set('notifications', new Immutable.Set()).
  set(
    'dashboard',
    new Immutable.Map().
      set('isOpen', false).
      set('activeSubmenu', null),
  );

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
    case 'HIDE_COMPONENT':
    case 'PROJECT_CREATED':
    case 'UNHIDE_COMPONENT':
      return state.setIn(
        ['editors', 'verticalFlex'],
        DEFAULT_VERTICAL_FLEX,
      );

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

    case 'EDITORS_UPDATE_VERTICAL_FLEX':
      return state.updateIn(['editors', 'verticalFlex'], (prevFlex) => {
        const newFlex = updateVerticalFlex(action.payload);
        return newFlex ? Immutable.fromJS(newFlex) : prevFlex;
      });

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
      return state.update(
        'notifications',
        errors => errors.add(new Immutable.Map(
          pick(action.payload, ['type', 'severity', 'payload']),
        )),
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

    default:
      return state;
  }
}
