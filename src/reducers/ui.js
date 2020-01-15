import Immutable from 'immutable';

import constant from 'lodash-es/constant';
import handleAction from 'redux-actions/lib/handleAction';
import handleActions from 'redux-actions/lib/handleActions';
import {combineReducers} from 'redux-immutable';

import {
  applicationLoaded,
  changeCurrentProject,
  clearConsoleEntries,
  linkGithubIdentity,
  projectCompilationFailed,
  projectCompiled,
  unlinkGithubIdentity,
  userLoggedOut,
} from '../actions';
import {assignmentCreated, assignmentNotCreated} from '../actions/assignments';
import {
  gapiClientUnavailable,
  projectExportError,
  projectExportNotDisplayed,
  snapshotCreated,
  snapshotExportError,
  snapshotImportError,
  snapshotNotFound,
} from '../actions/clients';
import {
  gistImportError,
  gistNotFound,
  projectCreated,
  updateProjectInstructions,
  updateProjectSource,
} from '../actions/projects';
import {
  cancelEditingInstructions,
  closeAssignmentCreator,
  closeLoginPrompt,
  editorFocusedRequestedLine,
  focusLine,
  hideSaveIndicator,
  notificationTriggered,
  openAssignmentCreator,
  openLoginPrompt,
  showSaveIndicator,
  startDragColumnDivider,
  startEditingInstructions,
  stopDragColumnDivider,
  toggleArchivedView,
  toggleEditorTextSize,
  toggleTopBarMenu,
  updateNotificationMetadata,
  userDismissedNotification,
  userDoneTyping,
} from '../actions/ui';
import {identityLinked, linkIdentityFailed, logIn} from '../actions/user';
import {EditorLocation, Notification, UiState} from '../records';

function addNotification(notifications, type, severity, metadata = {}) {
  return notifications.set(
    type,
    new Notification({type, severity, metadata: new Immutable.Map(metadata)}),
  );
}

function dismissNotification(notifications, type) {
  return notifications.delete(type);
}

function closeTopBarMenu(menu, menuToClose) {
  return menu === menuToClose ? null : menu;
}

export default combineReducers(
  {
    isArchivedViewOpen: handleActions(
      {
        [changeCurrentProject]: constant(false),
        [toggleArchivedView]: isArchivedViewOpen => !isArchivedViewOpen,
      },
      false,
    ),

    isAssignmentCreatorOpen: handleActions(
      {
        [openAssignmentCreator]: constant(true),

        [closeAssignmentCreator]: constant(false),

        [assignmentCreated]: constant(false),
        [assignmentNotCreated]: constant(false),
      },
      false,
    ),

    isDraggingColumnDivider: handleActions(
      {
        [startDragColumnDivider]: constant(true),
        [stopDragColumnDivider]: constant(false),
      },
      false,
    ),

    isEditingInstructions: handleActions(
      {
        [cancelEditingInstructions]: constant(false),
        [changeCurrentProject]: constant(false),
        [projectCreated]: constant(false),
        [startEditingInstructions]: constant(true),
        [updateProjectInstructions]: constant(false),
      },
      false,
    ),

    isExperimental: handleActions(
      {
        [applicationLoaded]: (state, {payload: {isExperimental}}) =>
          Boolean(isExperimental),
      },
      false,
    ),

    isLoginPromptOpen: handleActions(
      {
        [openLoginPrompt]: constant(true),
        [closeLoginPrompt]: constant(false),
        [logIn]: constant(false),
      },
      false,
    ),

    isTextSizeLarge: handleAction(
      toggleEditorTextSize,
      isTextSizeLarge => !isTextSizeLarge,
      false,
    ),

    isTyping: handleActions(
      {
        [updateProjectSource]: constant(true),
        [userDoneTyping]: constant(false),
      },
      false,
    ),

    notifications: handleActions(
      {
        [assignmentCreated]: (state, {payload: {assignment}}) =>
          addNotification(
            state,
            'project-export-complete',
            'notice',
            assignment,
          ),

        [assignmentNotCreated]: notifications =>
          addNotification(
            notifications,
            'assignment-not-created',
            'error',
          ).setIn(['isAssignmentCreatorOpen'], false),

        [gapiClientUnavailable]: notifications =>
          addNotification(notifications, 'gapi-client-unavailable', 'error'),

        [gistNotFound]: (notifications, {payload: {gistId}}) =>
          addNotification(notifications, 'gist-import-not-found', 'error', {
            gistId,
          }),

        [gistImportError]: (notifications, {payload: {gistId}}) =>
          addNotification(notifications, 'gist-import-error', 'error', {
            gistId,
          }),

        [identityLinked]: (
          notifications,
          {
            payload: {
              credential: {providerId: provider},
            },
          },
        ) =>
          addNotification(notifications, 'identity-linked', 'notice', {
            provider,
          }),

        [linkIdentityFailed]: notifications =>
          addNotification(notifications, 'link-identity-failed', 'error'),

        [notificationTriggered]: (
          notifications,
          {payload: {type, severity, metadata}},
        ) => addNotification(notifications, type, severity, metadata),

        [projectCompilationFailed]: notifications =>
          addNotification(notifications, 'project-compilation-failed', 'error'),

        [projectCompiled]: notifications =>
          dismissNotification(notifications, 'project-compilation-failed'),

        [projectExportError]: (notifications, {payload}) => {
          if (payload.name === 'EmptyGistError') {
            return addNotification(notifications, 'empty-gist', 'error');
          }
          return addNotification(
            notifications,
            `${payload.exportType}-export-error`,
            'error',
            payload,
          );
        },

        [projectExportNotDisplayed]: (notifications, {payload}) =>
          addNotification(
            notifications,
            'project-export-complete',
            'notice',
            payload,
          ),

        [snapshotCreated]: (notifications, {payload: snapshotKey}) =>
          addNotification(notifications, 'snapshot-created', 'notice', {
            snapshotKey,
          }),

        [snapshotExportError]: notifications =>
          addNotification(notifications, 'snapshot-export-error', 'error'),

        [snapshotImportError]: notifications =>
          addNotification(notifications, 'snapshot-import-error', 'error'),

        [snapshotNotFound]: notifications =>
          addNotification(notifications, 'snapshot-not-found', 'error'),

        [updateNotificationMetadata]: (notifications, {payload}) =>
          notifications.updateIn([payload.type, 'metadata'], metadata =>
            metadata.merge(payload.metadata),
          ),

        [updateProjectSource]: notifications =>
          notifications.delete('snapshot-created'),

        [userDismissedNotification]: (notifications, {payload: {type}}) =>
          dismissNotification(notifications, type),
      },
      new Immutable.Map(),
    ),

    openTopBarMenu: handleActions(
      {
        [changeCurrentProject]: menu => closeTopBarMenu(menu, 'projectPicker'),

        [closeTopBarMenu]: (menu, {payload: menuToClose}) =>
          menu === menuToClose ? null : menu,

        [linkGithubIdentity]: menu => closeTopBarMenu(menu, 'currentUser'),

        [toggleTopBarMenu]: (menu, {payload: menuToToggle}) =>
          menu === menuToToggle ? null : menuToToggle,

        [unlinkGithubIdentity]: menu => closeTopBarMenu(menu, 'currentUser'),

        [userLoggedOut]: menu => closeTopBarMenu(menu, 'currentUser'),
      },
      null,
    ),

    requestedFocusedLine: handleActions(
      {
        [clearConsoleEntries]: () =>
          new EditorLocation({
            component: 'console',
            line: 0,
            column: 0,
          }),

        [editorFocusedRequestedLine]: constant(null),

        [focusLine]: (_, {payload: {component, line, column}}) =>
          new EditorLocation({component, line, column}),
      },
      null,
    ),

    isSaveIndicatorVisible: handleActions(
      {
        [hideSaveIndicator]: constant(false),
        [showSaveIndicator]: constant(true),
      },
      false,
    ),
  },
  UiState,
);
