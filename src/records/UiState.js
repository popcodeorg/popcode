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
    isProjectPickerModalOpen: false,
    isTextSizeLarge: false,
    isTyping: false,
    notifications: new Map(),
    openTopBarMenu: null,
    requestedFocusedLine: null,
    saveIndicatorShown: false,
    projectsFilter: 'active',
  },
  'UiState',
);
