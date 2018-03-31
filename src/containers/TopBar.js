import {connect} from 'react-redux';
import TopBar from '../components/TopBar';
import {
  getCurrentAssignment,
  getCurrentProjectKey,
  getCurrentProjectInstructions,
  getCurrentUser,
  getCurrentValidationState,
  getEnabledLibraries,
  getOpenTopBarMenu,
  getAllProjectKeys,
  isEditingInstructions,
  isExperimental,
  isGistExportInProgress,
  isRepoExportInProgress,
  isSnapshotInProgress,
  isTextSizeLarge,
  isUserAuthenticated,
  isUserTyping,
} from '../selectors';
import {
  changeCurrentProject,
  closeTopBarMenu,
  createProject,
  createSnapshot,
  exportProject,
  openAssignmentSelector,
  submitAssignment,
  startEditingInstructions,
  toggleEditorTextSize,
  toggleLibrary,
  toggleTopBarMenu,
  logIn,
  logOut,
  updateAssignment,
} from '../actions';

function mapStateToProps(state) {
  return {
    assignment: getCurrentAssignment(state),
    currentProjectKey: getCurrentProjectKey(state),
    currentUser: getCurrentUser(state),
    enabledLibraries: getEnabledLibraries(state),
    hasInstructions: Boolean(getCurrentProjectInstructions(state)),
    isEditingInstructions: isEditingInstructions(state),
    isExperimental: isExperimental(state),
    isGistExportInProgress: isGistExportInProgress(state),
    isRepoExportInProgress: isRepoExportInProgress(state),
    isSnapshotInProgress: isSnapshotInProgress(state),
    isTextSizeLarge: isTextSizeLarge(state),
    isUserAuthenticated: isUserAuthenticated(state),
    isUserTyping: isUserTyping(state),
    openMenu: getOpenTopBarMenu(state),
    projectKeys: getAllProjectKeys(state),
    validationState: getCurrentValidationState(state),
  };
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
      dispatch(exportProject('repo'));
    },

    onToggleLibrary(projectKey, libraryKey) {
      dispatch(toggleLibrary(projectKey, libraryKey));
    },

    onLogOut() {
      dispatch(logOut());
    },

    onOpenAssignmentSelector() {
      dispatch(openAssignmentSelector());
    },

    onStartGithubLogIn() {
      dispatch(logIn('github'));
    },

    onStartGoogleLogIn() {
      dispatch(logIn('google'));
    },

    onStartEditingInstructions() {
      dispatch(startEditingInstructions());
    },

    onToggleTextSize() {
      dispatch(toggleEditorTextSize());
    },

    onSumbitAssignment() {
      dispatch(submitAssignment());
    },

    onUpdateAssignment() {
      dispatch(updateAssignment());
    },

  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TopBar);
