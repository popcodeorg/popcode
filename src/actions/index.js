import applicationLoaded from './applicationLoaded';

import {
  createSnapshot,
  exportGist,
  gistExportDisplayed,
  gistExportNotDisplayed,
  exportRepo,
  repoExportDisplayed,
  repoExportNotDisplayed,
} from './clients';

import {
  createProject,
  changeCurrentProject,
  toggleLibrary,
  hideComponent,
  unhideComponent,
  updateProjectSource,
} from './projects';

import {
  focusLine,
  editorFocusedRequestedLine,
  dragRowDivider,
  dragColumnDivider,
  startDragColumnDivider,
  stopDragColumnDivider,
  notificationTriggered,
  userDismissedNotification,
  updateNotificationMetadata,
  refreshPreview,
  popOutProject,
  toggleEditorTextSize,
  toggleTopBarMenu,
} from './ui';

import {
  addRuntimeError,
} from './errors';

import {
  userAuthenticated,
  userLoggedOut,
} from './user';

function toggleDashboard() {
  return {type: 'DASHBOARD_TOGGLED'};
}

export {
  createProject,
  createSnapshot,
  changeCurrentProject,
  updateProjectSource,
  toggleLibrary,
  userAuthenticated,
  userLoggedOut,
  addRuntimeError,
  hideComponent,
  unhideComponent,
  toggleDashboard,
  focusLine,
  editorFocusedRequestedLine,
  dragRowDivider,
  dragColumnDivider,
  startDragColumnDivider,
  stopDragColumnDivider,
  notificationTriggered,
  userDismissedNotification,
  updateNotificationMetadata,
  exportGist,
  exportRepo,
  gistExportDisplayed,
  gistExportNotDisplayed,
  popOutProject,
  applicationLoaded,
  refreshPreview,
  repoExportDisplayed,
  repoExportNotDisplayed,
  toggleEditorTextSize,
  toggleTopBarMenu,
};
