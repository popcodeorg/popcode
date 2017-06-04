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
} from './ui';

import {
  userAuthenticated,
  userLoggedOut,
} from './user';

function addRuntimeError(error) {
  return {
    type: 'RUNTIME_ERROR_ADDED',
    payload: {error},
  };
}

function clearRuntimeErrors() {
  return {
    type: 'RUNTIME_ERRORS_CLEARED',
  };
}

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
  clearRuntimeErrors,
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
  applicationLoaded,
};
