import {createAction} from 'redux-actions';

export const userDoneTyping = createAction('USER_DONE_TYPING');

export const userRequestedFocusedLine = createAction(
  'USER_REQUESTED_FOCUSED_LINE',
  (language, line, column) => ({language, line, column}),
  (_language, _line, _column, timestamp = Date.now()) => ({timestamp}),
);

export const editorFocusedRequestedLine = createAction(
  'EDITOR_FOCUSED_REQUESTED_LINE',
);

export const editorsUpdateVerticalFlex = createAction(
  'EDITORS_UPDATE_VERTICAL_FLEX',
);

export const notificationTriggered = createAction(
  'NOTIFICATION_TRIGGERED',
  (type, severity = 'error', payload = {}) => ({type, severity, payload}),
);

export const userDismissedNotification = createAction(
  'USER_DISMISSED_NOTIFICATION',
  type => ({type}),
);
