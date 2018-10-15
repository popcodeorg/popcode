import {Record, Map} from 'immutable';

export default Record(
  {
    isAssignmentCreatorOpen: false,
    isDraggingColumnDivider: false,
    isEditingInstructions: false,
    isExperimental: false,
    isTextSizeLarge: false,
    isTyping: false,
    loginReminder: 'IDLE',
    notifications: new Map(),
    openTopBarMenu: null,
    requestedFocusedLine: null,
    saveIndicatorShown: false,
    archivedViewOpen: false,
  },
  'UiState',
);
