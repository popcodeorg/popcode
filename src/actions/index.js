import applicationLoaded from './applicationLoaded';

import {
  exportGist,
  gistExportDisplayed,
  gistExportNotDisplayed,
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
  refreshPreview,
  popOutProject,
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

function toggleDashboardSubmenu(submenu) {
  return {type: 'DASHBOARD_SUBMENU_TOGGLED', payload: {submenu}};
}

export {
  createProject,
  changeCurrentProject,
  updateProjectSource,
  toggleLibrary,
  userAuthenticated,
  userLoggedOut,
  addRuntimeError,
  hideComponent,
  unhideComponent,
  toggleDashboard,
  toggleDashboardSubmenu,
  focusLine,
  editorFocusedRequestedLine,
  dragRowDivider,
  dragColumnDivider,
  startDragColumnDivider,
  stopDragColumnDivider,
  notificationTriggered,
  userDismissedNotification,
  exportGist,
  gistExportDisplayed,
  gistExportNotDisplayed,
  popOutProject,
  applicationLoaded,
  refreshPreview,
};
