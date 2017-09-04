import {connect} from 'react-redux';
import TopBar from '../components/TopBar';
import {
  getCurrentProjectKey,
  getCurrentUser,
  getCurrentValidationState,
  getEnabledLibraries,
  getOpenTopBarMenu,
  getAllProjectKeys,
  isExperimental,
  isGistExportInProgress,
  isSnapshotInProgress,
  isTextSizeLarge,
  isUserConfirmed,
  isUserTyping,
} from '../selectors';
import {
  changeCurrentProject,
  closeTopBarMenu,
  createProject,
  createSnapshot,
  exportGist,
  exportRepo,
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
    isExperimental: isExperimental(state),
    isGistExportInProgress: isGistExportInProgress(state),
    isSnapshotInProgress: isSnapshotInProgress(state),
    isTextSizeLarge: isTextSizeLarge(state),
    isUserConfirmed: isUserConfirmed(state),
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
      dispatch(exportGist());
    },

    onExportRepo() {
      dispatch(exportRepo());
    },

    onToggleLibrary(projectKey, libraryKey) {
      dispatch(toggleLibrary(projectKey, libraryKey));
    },

    onLogOut() {
      dispatch(logOut());
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
