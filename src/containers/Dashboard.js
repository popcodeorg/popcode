import {connect} from 'react-redux';
import {Dashboard} from '../components';
import {
  createProject,
  exportGist,
  exportRepo,
  toggleDashboardSubmenu,
} from '../actions';
import {
  getActiveSubmenu,
  getAllProjectKeys,
  getCurrentProject,
  getCurrentUser,
  isDashboardOpen,
  isExperimental,
  isGistExportInProgress,
} from '../selectors';

function mapStateToProps(state) {
  return {
    activeSubmenu: getActiveSubmenu(state),
    currentProject: getCurrentProject(state),
    currentUser: getCurrentUser(state),
    gistExportInProgress: isGistExportInProgress(state),
    isExperimental: isExperimental(state),
    isOpen: isDashboardOpen(state),
    projectKeys: getAllProjectKeys(state),
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

    onNewProject() {
      dispatch(createProject());
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
