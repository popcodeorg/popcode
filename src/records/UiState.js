import {Map, Record} from 'immutable';

export default Record(
  {
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
    projectsFilter: 'active',
  },
  'UiState',
);
