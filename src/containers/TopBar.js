import {connect} from 'react-redux';
import TopBar from '../components/TopBar';
import {
  getAssignment,
  getCurrentProjectKey,
  getCurrentUser,
  getCurrentValidationState,
  getEnabledLibraries,
  getOpenTopBarMenu,
  getAllProjectKeys,
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
  openCourseWorkSelector,
  submitAssignment,
  toggleEditorTextSize,
  toggleLibrary,
  toggleTopBarMenu,
  logIn,
  logOut,
} from '../actions';

function mapStateToProps(state) {
  return {
    assignment: getAssignment(state),
    currentProjectKey: getCurrentProjectKey(state),
    currentUser: getCurrentUser(state),
    enabledLibraries: getEnabledLibraries(state),
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

    onOpenCourseWorkSelector() {
      dispatch(openCourseWorkSelector());
    },

    onStartLogIn() {
      dispatch(logIn());
    },

    onToggleTextSize() {
      dispatch(toggleEditorTextSize());
    },

    onSumbitAssignment() {
      dispatch(submitAssignment());
    },

  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TopBar);
