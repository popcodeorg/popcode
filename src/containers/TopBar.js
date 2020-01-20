import {connect} from 'react-redux';

import {
  closeTopBarMenu,
  createProject,
  createSnapshot,
  exportProject,
  linkGithubIdentity,
  logIn,
  logOut,
  openAssignmentCreator,
  openProjectPickerModal,
  startEditingInstructions,
  toggleEditorTextSize,
  toggleLibrary,
  toggleTopBarMenu,
  unlinkGithubIdentity,
} from '../actions';

import TopBar from '../components/TopBar';

import {
  getAllProjectKeys,
  getCurrentProjectExportedRepoName,
  getCurrentProjectInstructions,
  getCurrentProjectKey,
  getCurrentUser,
  getCurrentValidationState,
  getEnabledLibraries,
  getOpenTopBarMenu,
  isClassroomExportInProgress,
  isEditingInstructions,
  isExperimental,
  isGapiReady,
  isGistExportInProgress,
  isRepoExportInProgress,
  isSaveIndicatorVisible,
  isSnapshotInProgress,
  isTextSizeLarge,
  isUserAnonymous,
  isUserAuthenticated,
  isUserAuthenticatedWithGithub,
  isUserAuthenticatedWithGoogle,
  isUserTyping,
} from '../selectors';

function mapStateToProps(state) {
  return {
    currentProjectKey: getCurrentProjectKey(state),
    currentUser: getCurrentUser(state),
    enabledLibraries: getEnabledLibraries(state),
    hasInstructions: Boolean(getCurrentProjectInstructions(state)),
    hasExportedRepo: Boolean(getCurrentProjectExportedRepoName(state)),
    isEditingInstructions: isEditingInstructions(state),
    isExperimental: isExperimental(state),
    isGapiReady: isGapiReady(state),
    isGistExportInProgress: isGistExportInProgress(state),
    isRepoExportInProgress: isRepoExportInProgress(state),
    isClassroomExportInProgress: isClassroomExportInProgress(state),
    shouldShowSavedIndicator: isSaveIndicatorVisible(state),
    isSnapshotInProgress: isSnapshotInProgress(state),
    isTextSizeLarge: isTextSizeLarge(state),
    isUserAnonymous: isUserAnonymous(state),
    isUserAuthenticated: isUserAuthenticated(state),
    isUserAuthenticatedWithGithub: isUserAuthenticatedWithGithub(state),
    isUserAuthenticatedWithGoogle: isUserAuthenticatedWithGoogle(state),
    isUserTyping: isUserTyping(state),
    openMenu: getOpenTopBarMenu(state),
    projectKeys: getAllProjectKeys(state),
    validationState: getCurrentValidationState(state),
  };
}

function exportRepo(dispatch) {
  dispatch(exportProject('repo'));
}

function mapDispatchToProps(dispatch) {
  return {
    onClickMenu(menuKey) {
      dispatch(toggleTopBarMenu(menuKey));
    },

    onCloseMenu(menuKey) {
      dispatch(closeTopBarMenu(menuKey));
    },

    onCreateNewProject() {
      dispatch(createProject());
    },

    onCreateSnapshot() {
      dispatch(createSnapshot());
    },

    onExportGist() {
      dispatch(exportProject('gist'));
    },

    onExportRepo() {
      exportRepo(dispatch);
    },

    onUpdateRepo() {
      exportRepo(dispatch);
    },

    onExportToClassroom() {
      dispatch(exportProject('classroom'));
    },

    onToggleLibrary(projectKey, libraryKey) {
      dispatch(toggleLibrary(projectKey, libraryKey));
    },

    onLinkGitHub() {
      dispatch(linkGithubIdentity());
    },

    onLogOut() {
      dispatch(logOut());
    },

    onOpenAssignmentCreator() {
      dispatch(openAssignmentCreator());
    },

    onOpenProjectPickerModal() {
      dispatch(openProjectPickerModal());
    },

    onStartEditingInstructions(projectKey) {
      dispatch(startEditingInstructions(projectKey));
    },

    onStartGithubLogIn() {
      dispatch(logIn('github'));
    },

    onStartGoogleLogIn() {
      dispatch(logIn());
    },

    onUnlinkGitHub() {
      dispatch(unlinkGithubIdentity());
    },

    onToggleTextSize() {
      dispatch(toggleEditorTextSize());
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TopBar);
