import {createAction} from 'redux-actions';

export const userDoneTyping = createAction('USER_DONE_TYPING');

export const focusLine = createAction(
  'FOCUS_LINE',
  (component, line, column) => ({component, line, column}),
  (_component, _line, _column, timestamp = Date.now()) => ({timestamp}),
);

export const editorFocusedRequestedLine = createAction(
  'EDITOR_FOCUSED_REQUESTED_LINE',
);

export const editorFocused = createAction(
  'EDITOR_FOCUSED',
  (source, cursor, language) => ({source, cursor, language}),
);

export const editorBlurred = createAction(
  'EDITOR_BLURRED',
);

<<<<<<< HEAD
export const editorResized = createAction(
  'EDITOR_RESIZED',
=======
export const dragRowDivider = createAction(
  'DRAG_ROW_DIVIDER',
);

export const dragColumnDivider = createAction(
  'DRAG_COLUMN_DIVIDER',
>>>>>>> e90fafb... update window resize, update element highlighter, write unit test
);

export const startDragColumnDivider = createAction(
  'START_DRAG_COLUMN_DIVIDER',
);

export const stopDragColumnDivider = createAction(
  'STOP_DRAG_COLUMN_DIVIDER',
);

export const popOutProject = createAction(
  'POP_OUT_PROJECT',
);

export const notificationTriggered = createAction(
  'NOTIFICATION_TRIGGERED',
  (type, severity = 'error', metadata = {}) => ({type, severity, metadata}),
);

export const userDismissedNotification = createAction(
  'USER_DISMISSED_NOTIFICATION',
  type => ({type}),
);

export const currentCursorChanged = createAction(
  'CURRENT_CURSOR_CHANGED',
  (source, cursor, language) => ({source, cursor, language}),
);

export const currentFocusedSelectorChanged = createAction(
  'CURRENT_FOCUSED_SELECTOR_CHANGED',
);

export const updateNotificationMetadata = createAction(
  'UPDATE_NOTIFICATION_METADATA',
  (type, metadata) => ({type, metadata}),
);

export const toggleEditorTextSize = createAction(
  'TOGGLE_EDITOR_TEXT_SIZE',
);

export const toggleTopBarMenu = createAction(
  'TOGGLE_TOP_BAR_MENU',
);

export const closeTopBarMenu = createAction(
  'CLOSE_TOP_BAR_MENU',
);

export const startEditingInstructions = createAction(
  'START_EDITING_INSTRUCTIONS',
  projectKey => ({projectKey}),
  (_projectKey, timestamp = Date.now()) => ({timestamp}),
);

export const cancelEditingInstructions = createAction(
  'CANCEL_EDITING_INSTRUCTIONS',
);

export const showSaveIndicator = createAction(
  'SHOW_SAVE_INDICATOR',
);

export const hideSaveIndicator = createAction(
  'HIDE_SAVE_INDICATOR',
);
