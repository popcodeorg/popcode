import {connect} from 'react-redux';

import TopBar from '../components/TopBar';
import {
  getCurrentProjectExportedRepoName,
  getCurrentProjectKey,
  getCurrentProjectInstructions,
  getCurrentUser,
  getCurrentValidationState,
  getEnabledLibraries,
  getOpenTopBarMenu,
  getAllProjectKeys,
  getAllProjects,
  isArchivedViewOpen,
  isEditingInstructions,
  isExperimental,
  isGapiReady,
  isGistExportInProgress,
  isRepoExportInProgress,
  isClassroomExportInProgress,
  isSaveIndicatorShown,
  isSnapshotInProgress,
  isTextSizeLarge,
  isUserAnonymous,
  isUserAuthenticatedWithGithub,
  isUserAuthenticatedWithGoogle,
  isUserAuthenticated,
  isUserTyping,
} from '../selectors';

import {
  changeCurrentProject,
  closeTopBarMenu,
  createProject,
  createSnapshot,
  exportProject,
  linkGithubIdentity,
  unlinkGithubIdentity,
  openAssignmentCreator,
  startEditingInstructions,
  toggleEditorTextSize,
  toggleLibrary,
  toggleTopBarMenu,
  toggleArchivedView,
  logIn,
  logOut,
} from '../actions';

function mapStateToProps(state) {
  return {
    currentProjectKey: getCurrentProjectKey(state),
    currentUser: getCurrentUser(state),
    enabledLibraries: getEnabledLibraries(state),
    hasInstructions: Boolean(getCurrentProjectInstructions(state)),
    hasExportedRepo: Boolean(getCurrentProjectExportedRepoName(state)),
    shouldShowArchivedProjects: isArchivedViewOpen(state),
    isEditingInstructions: isEditingInstructions(state),
    isExperimental: isExperimental(state),
    isGapiReady: isGapiReady(state),
    isGistExportInProgress: isGistExportInProgress(state),
    isRepoExportInProgress: isRepoExportInProgress(state),
    isClassroomExportInProgress: isClassroomExportInProgress(state),
    shouldShowSavedIndicator: isSaveIndicatorShown(state),
    isSnapshotInProgress: isSnapshotInProgress(state),
    isTextSizeLarge: isTextSizeLarge(state),
    isUserAnonymous: isUserAnonymous(state),
    isUserAuthenticated: isUserAuthenticated(state),
    isUserAuthenticatedWithGithub: isUserAuthenticatedWithGithub(state),
    isUserAuthenticatedWithGoogle: isUserAuthenticatedWithGoogle(state),
    isUserTyping: isUserTyping(state),
    openMenu: getOpenTopBarMenu(state),
    projectKeys: getAllProjectKeys(state),
    projects: getAllProjects(state),
    validationState: getCurrentValidationState(state),
  };
}

function exportRepo(dispatch) {
  dispatch(exportProject('repo'));
}

function mapDispatchToProps(dispatch) {
  return {
    onChangeCurrentProject(projectKey) {
      dispatch(changeCurrentProject(projectKey));
    },

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

    onStartEditingInstructions(projectKey) {
      dispatch(startEditingInstructions(projectKey));
    },

    onStartGithubLogIn() {
      dispatch(logIn('github'));
    },

    onStartGoogleLogIn() {
      dispatch(logIn('google'));
    },

    onUnlinkGitHub() {
      dispatch(unlinkGithubIdentity());
    },

    onToggleTextSize() {
      dispatch(toggleEditorTextSize());
    },

    onToggleViewArchived() {
      dispatch(toggleArchivedView());
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TopBar);
