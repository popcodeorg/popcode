import {Map, Record} from 'immutable';

export default Record(
  {
    isArchivedViewOpen: false,
    isAssignmentCreatorOpen: false,
    isDraggingColumnDivider: false,
    isEditingInstructions: false,
    isExperimental: false,
    isLoginPromptOpen: false,
    isSaveIndicatorVisible: false,
    isTextSizeLarge: false,
    isTyping: false,
    notifications: new Map(),
    openTopBarMenu: null,
    requestedFocusedLine: null,
  },
  'UiState',
);
