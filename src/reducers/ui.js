import {Map} from 'immutable';

import handleActions from 'redux-actions/lib/handleActions';

import {identity} from 'rxjs';

import {EditorLocation, Notification, UiState} from '../records';
import {
  changeCurrentProject,
  clearConsoleEntries,
  userLoggedOut,
  linkGithubIdentity,
  unlinkGithubIdentity,
  applicationLoaded,
  projectCompilationFailed,
  projectCompiled,
} from '../actions';
import {
  projectCreated,
  updateProjectSource,
  gistNotFound,
  gistImportError,
  updateProjectInstructions,
} from '../actions/projects';
import {
  userDoneTyping,
  focusLine,
  editorFocusedRequestedLine,
  startDragColumnDivider,
  stopDragColumnDivider,
  notificationTriggered,
  userDismissedNotification,
  updateNotificationMetadata,
  toggleEditorTextSize,
  toggleTopBarMenu,
  startEditingInstructions,
  cancelEditingInstructions,
  showSaveIndicator,
  hideSaveIndicator,
  toggleArchivedView,
  openAssignmentCreator,
  closeAssignmentCreator,
  openLoginPrompt,
  closeLoginPrompt,
} from '../actions/ui';
import {identityLinked, linkIdentityFailed, logIn} from '../actions/user';
import {
  snapshotCreated,
  snapshotExportError,
  snapshotImportError,
  snapshotNotFound,
  projectExportNotDisplayed,
  projectExportError,
  gapiClientUnavailable,
} from '../actions/clients';
import {assignmentCreated, assignmentNotCreated} from '../actions/assignments';

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

export default handleActions(
  {
    [changeCurrentProject]: state =>
      state
        .set('isEditingInstructions', false)
        .update('openTopBarMenu', menu =>
          menu === 'projectPicker' ? null : menu,
        )
        .set('archivedViewOpen', false),

    [projectCreated]: state => state.set('isEditingInstructions', false),

    [updateProjectSource]: state =>
      state
        .set('isTyping', true)
        .deleteIn(['notifications', 'snapshot-created']),

    [userDoneTyping]: state => state.set('isTyping', false),

    [focusLine]: (state, {payload: {component, line, column}}) =>
      state.set(
        'requestedFocusedLine',
        new EditorLocation({component, line, column}),
      ),

    [clearConsoleEntries]: state =>
      state.set(
        'requestedFocusedLine',
        new EditorLocation({
          component: 'console',
          line: 0,
          column: 0,
        }),
      ),

    [editorFocusedRequestedLine]: state =>
      state.set('requestedFocusedLine', null),

    [startDragColumnDivider]: state =>
      state.set('isDraggingColumnDivider', true),

    [stopDragColumnDivider]: state =>
      state.set('isDraggingColumnDivider', false),

    [gistNotFound]: (state, {payload: {gistId}}) =>
      addNotification(state, 'gist-import-not-found', 'error', {
        gistId,
      }),

    [gistImportError]: (state, {payload: {gistId}}) =>
      addNotification(state, 'gist-import-error', 'error', {
        gistId,
      }),

    [notificationTriggered]: (state, {payload: {type, severity, metadata}}) =>
      addNotification(state, type, severity, metadata),

    [userDismissedNotification]: (state, {payload: {type}}) =>
      dismissNotification(state, type),

    [updateNotificationMetadata]: (state, {payload}) =>
      state.updateIn(['notifications', payload.type, 'metadata'], metadata =>
        metadata.merge(payload.metadata),
      ),

    [userLoggedOut]: state => closeTopBarMenu(state, 'currentUser'),
    [linkGithubIdentity]: state => closeTopBarMenu(state, 'currentUser'),
    [unlinkGithubIdentity]: state => closeTopBarMenu(state, 'currentUser'),

    [identityLinked]: state =>
      addNotification(state, 'identity-unlinked', 'notice'),

    [snapshotCreated]: (state, {payload: snapshotKey}) =>
      addNotification(state, 'snapshot-created', 'notice', {
        snapshotKey,
      }),

    [applicationLoaded]: (state, {payload: {isExperimental}}) => {
      if (isExperimental) {
        return state.set('isExperimental', true);
      }
      return state;
    },

    [snapshotExportError]: state =>
      addNotification(state, 'snapshot-export-error', 'error'),

    [snapshotImportError]: state =>
      addNotification(state, 'snapshot-import-error', 'error'),

    [snapshotNotFound]: state =>
      addNotification(state, 'snapshot-not-found', 'error'),

    [toggleEditorTextSize]: state =>
      state.update('isTextSizeLarge', isTextSizeLarge => !isTextSizeLarge),

    [toggleTopBarMenu]: (state, {payload: menuToToggle}) =>
      state.update('openTopBarMenu', menu =>
        menu === menuToToggle ? null : menuToToggle,
      ),

    [closeTopBarMenu]: (state, {payload: menuToClose}) =>
      state.update('openTopBarMenu', menu =>
        menu === menuToClose ? null : menu,
      ),

    [projectExportNotDisplayed]: (state, {payload}) =>
      addNotification(state, 'project-export-complete', 'notice', payload),

    [projectExportError]: (state, {payload}) => {
      if (payload.name === 'EmptyGistError') {
        return addNotification(state, 'empty-gist', 'error');
      }
      return addNotification(
        state,
        `${payload.exportType}-export-error`,
        'error',
        payload,
      );
    },

    [projectCompilationFailed]: state =>
      addNotification(state, 'project-compilation-failed', 'error'),

    [projectCompiled]: state =>
      dismissNotification(state, 'project-compilation-failed'),

    [startEditingInstructions]: state =>
      state.set('isEditingInstructions', true),

    [cancelEditingInstructions]: state =>
      state.set('isEditingInstructions', false),

    [updateProjectInstructions]: state =>
      state.set('isEditingInstructions', false),

    [showSaveIndicator]: state => state.set('saveIndicatorShown', true),

    [hideSaveIndicator]: state => state.set('saveIndicatorShown', false),

    [toggleArchivedView]: state =>
      state.update('archivedViewOpen', archivedViewOpen => !archivedViewOpen),

    [identityLinked]: (
      state,
      {
        payload: {
          credential: {providerId: provider},
        },
      },
    ) =>
      addNotification(state, 'identity-linked', 'notice', {
        provider,
      }),

    [linkIdentityFailed]: state =>
      addNotification(state, 'link-identity-failed', 'error'),

    [openAssignmentCreator]: state =>
      state.setIn(['isAssignmentCreatorOpen'], true),

    [closeAssignmentCreator]: state =>
      state.setIn(['isAssignmentCreatorOpen'], false),

    [assignmentCreated]: (state, {payload: {assignment}}) =>
      addNotification(
        state,
        'project-export-complete',
        'notice',
        assignment,
      ).set('isAssignmentCreatorOpen', false),

    [assignmentNotCreated]: state =>
      addNotification(state, 'assignment-not-created', 'error').setIn(
        ['isAssignmentCreatorOpen'],
        false,
      ),

    [gapiClientUnavailable]: state =>
      addNotification(state, 'gapi-client-unavailable', 'error'),

    [openLoginPrompt]: state => state.set('isLoginPromptOpen', true),

    [closeLoginPrompt]: state => state.set('isLoginPromptOpen', false),
    [logIn]: state => state.set('isLoginPromptOpen', false),
  },
  defaultState,
);
