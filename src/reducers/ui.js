import {Map} from 'immutable';

import {EditorLocation, Notification, UiState} from '../records';

const defaultState = new UiState();

function addNotification(state, type, severity, metadata = {}) {
  return state.setIn(
    ['notifications', type],
    new Notification({type, severity, metadata: new Map(metadata)}),
  );
}

function dismissNotification(state, type) {
  return state.update('notifications', notifications =>
    notifications.delete(type),
  );
}

function closeTopBarMenu(state, menuToClose) {
  return state.update('openTopBarMenu', menu =>
    menu === menuToClose ? null : menu,
  );
}

export default function ui(stateIn, action) {
  let state = stateIn;
  if (state === undefined) {
    state = defaultState;
  }

  switch (action.type) {
    case 'CHANGE_CURRENT_PROJECT':
      return state
        .set('isEditingInstructions', false)
        .update('openTopBarMenu', menu =>
          menu === 'projectPicker' ? null : menu,
        )
        .set('archivedViewOpen', false);

    case 'PROJECT_CREATED':
      return state.set('isEditingInstructions', false);

    case 'UPDATE_PROJECT_SOURCE':
      return state
        .set('isTyping', true)
        .deleteIn(['notifications', 'snapshot-created']);

    case 'USER_DONE_TYPING':
      return state.set('isTyping', false);

    case 'FOCUS_LINE':
      return state.set(
        'requestedFocusedLine',
        new EditorLocation({
          component: action.payload.component,
          line: action.payload.line,
          column: action.payload.column,
        }),
      );

    case 'CLEAR_CONSOLE_ENTRIES':
      return state.set(
        'requestedFocusedLine',
        new EditorLocation({
          component: 'console',
          line: 0,
          column: 0,
        }),
      );

    case 'EDITOR_FOCUSED_REQUESTED_LINE':
      return state.set('requestedFocusedLine', null);

    case 'START_DRAG_COLUMN_DIVIDER':
      return state.set('isDraggingColumnDivider', true);

    case 'STOP_DRAG_COLUMN_DIVIDER':
      return state.set('isDraggingColumnDivider', false);

    case 'GIST_NOT_FOUND':
      return addNotification(state, 'gist-import-not-found', 'error', {
        gistId: action.payload.gistId,
      });

    case 'GIST_IMPORT_ERROR':
      return addNotification(state, 'gist-import-error', 'error', {
        gistId: action.payload.gistId,
      });

    case 'NOTIFICATION_TRIGGERED':
      return addNotification(
        state,
        action.payload.type,
        action.payload.severity,
        action.payload.metadata,
      );

    case 'USER_DISMISSED_NOTIFICATION':
      return dismissNotification(state, action.payload.type);

    case 'UPDATE_NOTIFICATION_METADATA':
      return state.updateIn(
        ['notifications', action.payload.type, 'metadata'],
        metadata => metadata.merge(action.payload.metadata),
      );

    case 'USER_LOGGED_OUT':
    case 'LINK_GITHUB_IDENTITY':
    case 'UNLINK_GITHUB_IDENTITY':
      return closeTopBarMenu(state, 'currentUser');

    case 'IDENTITY_UNLINKED':
      return addNotification(state, 'identity-unlinked', 'notice');

    case 'SNAPSHOT_CREATED':
      return addNotification(state, 'snapshot-created', 'notice', {
        snapshotKey: action.payload,
      });

    case 'APPLICATION_LOADED':
      if (action.payload.isExperimental) {
        return state.set('isExperimental', true);
      }
      return state;

    case 'SNAPSHOT_EXPORT_ERROR':
      return addNotification(state, 'snapshot-export-error', 'error');

    case 'SNAPSHOT_IMPORT_ERROR':
      return addNotification(state, 'snapshot-import-error', 'error');

    case 'SNAPSHOT_NOT_FOUND':
      return addNotification(state, 'snapshot-not-found', 'error');

    case 'TOGGLE_EDITOR_TEXT_SIZE':
      return state.update(
        'isTextSizeLarge',
        isTextSizeLarge => !isTextSizeLarge,
      );

    case 'TOGGLE_TOP_BAR_MENU':
      return state.update('openTopBarMenu', menu =>
        menu === action.payload ? null : action.payload,
      );

    case 'CLOSE_TOP_BAR_MENU':
      return state.update('openTopBarMenu', menu =>
        menu === action.payload ? null : menu,
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
        return addNotification(state, 'empty-gist', 'error');
      }
      return addNotification(
        state,
        `${action.payload.exportType}-export-error`,
        'error',
        action.payload,
      );

    case 'PROJECT_COMPILATION_FAILED':
      return addNotification(state, 'project-compilation-failed', 'error');

    case 'PROJECT_COMPILED':
      return dismissNotification(state, 'project-compilation-failed');

    case 'START_EDITING_INSTRUCTIONS':
      return state.set('isEditingInstructions', true);

    case 'CANCEL_EDITING_INSTRUCTIONS':
    case 'UPDATE_PROJECT_INSTRUCTIONS':
      return state.set('isEditingInstructions', false);

    case 'SHOW_SAVE_INDICATOR':
      return state.set('saveIndicatorShown', true);

    case 'HIDE_SAVE_INDICATOR':
      return state.set('saveIndicatorShown', false);
    case 'TOGGLE_ARCHIVED_VIEW':
      return state.update(
        'archivedViewOpen',
        archivedViewOpen => !archivedViewOpen,
      );

    case 'IDENTITY_LINKED':
      return addNotification(state, 'identity-linked', 'notice', {
        provider: action.payload.credential.providerId,
      });

    case 'LINK_IDENTITY_FAILED':
      return addNotification(state, 'link-identity-failed', 'error');

    case 'OPEN_ASSIGNMENT_CREATOR':
      return state.setIn(['isAssignmentCreatorOpen'], true);

    case 'CLOSE_ASSIGNMENT_CREATOR':
      return state.setIn(['isAssignmentCreatorOpen'], false);

    case 'ASSIGNMENT_CREATED':
      return addNotification(
        state,
        'project-export-complete',
        'notice',
        action.payload.assignment,
      ).setIn(['isAssignmentCreatorOpen'], false);

    case 'GAPI_CLIENT_UNAVAILABLE':
      return addNotification(state, 'gapi-client-unavailable', 'error');

    case 'ASSIGNMENT_NOT_CREATED':
      return addNotification(state, 'assignment-not-created', 'error').setIn(
        ['isAssignmentCreatorOpen'],
        false,
      );

    default:
      return state;
  }
}
