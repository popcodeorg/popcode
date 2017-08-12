import {connect} from 'react-redux';
import {Dashboard} from '../components';
import {
  changeCurrentProject,
  createProject,
  exportGist,
  exportRepo,
  toggleDashboardSubmenu,
  toggleLibrary,
} from '../actions';
import {
  getActiveSubmenu,
  getAllProjects,
  getCurrentProject,
  getCurrentUser,
  isDashboardOpen,
  isExperimental,
  isGistExportInProgress,
} from '../selectors';

function mapStateToProps(state) {
  return {
    activeSubmenu: getActiveSubmenu(state),
    allProjects: getAllProjects(state),
    currentProject: getCurrentProject(state),
    currentUser: getCurrentUser(state),
    gistExportInProgress: isGistExportInProgress(state),
    isExperimental: isExperimental(state),
    isOpen: isDashboardOpen(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onExportGist() {
      dispatch(exportGist());
    },

    onExportRepo() {
      dispatch(exportRepo());
    },

    onLibraryToggled(projectKey, libraryKey) {
      dispatch(toggleLibrary(projectKey, libraryKey));
    },

    onNewProject() {
      dispatch(createProject());
    },

    onProjectSelected(project) {
      dispatch(changeCurrentProject(project.projectKey));
    },

    onSubmenuToggled(submenu) {
      dispatch(toggleDashboardSubmenu(submenu));
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Dashboard);
