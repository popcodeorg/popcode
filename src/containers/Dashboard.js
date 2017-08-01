import {connect} from 'react-redux';
import isError from 'lodash/isError';
import isString from 'lodash/isString';
import Bugsnag from '../util/Bugsnag';
import {Dashboard} from '../components';
import {
  changeCurrentProject,
  createProject,
  createSnapshot,
  exportGist,
  exportRepo,
  notificationTriggered,
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
  isSnapshotInProgress,
} from '../selectors';
import {
  signIn,
  signOut,
} from '../clients/firebase';

function mapStateToProps(state) {
  return {
    activeSubmenu: getActiveSubmenu(state),
    allProjects: getAllProjects(state),
    currentProject: getCurrentProject(state),
    currentUser: getCurrentUser(state),
    gistExportInProgress: isGistExportInProgress(state),
    isExperimental: isExperimental(state),
    isOpen: isDashboardOpen(state),
    snapshotInProgress: isSnapshotInProgress(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onCreateSnapshot() {
      dispatch(createSnapshot());
    },

    onExportGist() {
      dispatch(exportGist());
    },

    onExportRepo() {
      dispatch(exportRepo());
    },

    onLibraryToggled(projectKey, libraryKey) {
      dispatch(toggleLibrary(projectKey, libraryKey));
    },

    onLogOut() {
      signOut();
    },

    onNewProject() {
      dispatch(createProject());
    },

    onProjectSelected(project) {
      dispatch(changeCurrentProject(project.projectKey));
    },

    onStartLogIn() {
      signIn().catch((e) => {
        switch (e.code) {
          case 'auth/popup-closed-by-user':
            dispatch(notificationTriggered('user-cancelled-auth'));
            break;
          case 'auth/network-request-failed':
            dispatch(notificationTriggered('auth-network-error'));
            break;
          case 'auth/cancelled-popup-request':
            break;
          case 'auth/web-storage-unsupported':
          case 'auth/operation-not-supported-in-this-environment':
            dispatch(
              notificationTriggered('auth-third-party-cookies-disabled'),
            );
            break;
          default:
            dispatch(notificationTriggered('auth-error'));
            if (isError(e)) {
              Bugsnag.notifyException(e, e.code);
            } else if (isString(e)) {
              Bugsnag.notifyException(new Error(e));
            }
            break;
        }
      });
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
