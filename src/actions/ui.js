import {createAction} from 'redux-actions';

export const userDoneTyping = createAction('USER_DONE_TYPING');

export const focusLine = createAction(
  'FOCUS_LINE',
  (language, line, column) => ({language, line, column}),
  (_language, _line, _column, timestamp = Date.now()) => ({timestamp}),
);

export const editorFocusedRequestedLine = createAction(
  'EDITOR_FOCUSED_REQUESTED_LINE',
);

export const dragDivider = createAction(
  'DRAG_DIVIDER',
  (section, data) => ({section, data})
);

export const startDragDivider = createAction(
  'START_DRAG_DIVIDER',
);

export const stopDragDivider = createAction(
  'STOP_DRAG_DIVIDER',
);

export const storeResizableSectionRef = createAction(
  'STORE_RESIZABLE_SECTION_REF',
  (section, index, ref) => ({section, index, ref}),
);

export const storeDividerRef = createAction(
  'STORE_DIVIDER_REF',
  (section, ref) => ({section, ref}),
);

export const popOutProject = createAction(
  'POP_OUT_PROJECT',
);

export const notificationTriggered = createAction(
  'NOTIFICATION_TRIGGERED',
  (type, severity = 'error', payload = {}) => ({type, severity, payload}),
);

export const userDismissedNotification = createAction(
  'USER_DISMISSED_NOTIFICATION',
  type => ({type}),
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
