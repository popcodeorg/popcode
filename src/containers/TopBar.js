import {connect} from 'react-redux';
import TopBar from '../components/TopBar';
import {
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
  isClassroomExportInProgress,
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
  startEditingInstructions,
  toggleEditorTextSize,
  toggleLibrary,
  toggleTopBarMenu,
  logIn,
  logOut,
} from '../actions';

function mapStateToProps(state) {
  return {
    currentProjectKey: getCurrentProjectKey(state),
    currentUser: getCurrentUser(state),
    enabledLibraries: getEnabledLibraries(state),
    hasInstructions: Boolean(getCurrentProjectInstructions(state)),
    isEditingInstructions: isEditingInstructions(state),
    isExperimental: isExperimental(state),
    isGistExportInProgress: isGistExportInProgress(state),
    isRepoExportInProgress: isRepoExportInProgress(state),
    isClassroomExportInProgress: isClassroomExportInProgress(state),
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

    onExportToClassroom() {
      dispatch(exportProject('classroom'));
    },

    onToggleLibrary(projectKey, libraryKey) {
      dispatch(toggleLibrary(projectKey, libraryKey));
    },

    onLogOut() {
      dispatch(logOut());
    },

    onStartEditingInstructions(projectKey) {
      dispatch(startEditingInstructions(projectKey));
    },

    onStartLogIn() {
      dispatch(logIn());
    },

    onToggleTextSize() {
      dispatch(toggleEditorTextSize());
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TopBar);
