import isError from 'lodash/isError';
import isString from 'lodash/isString';
import {connect} from 'react-redux';
import Bugsnag from '../util/Bugsnag';
import {TopBar} from '../components';
import {
  getCurrentProjectKey,
  getCurrentUser,
  getCurrentValidationState,
  getEnabledLibraries,
  getOpenTopBarMenu,
  isDashboardOpen,
  isSnapshotInProgress,
  isTextSizeLarge,
  isUserTyping,
} from '../selectors';
import {
  createSnapshot,
  notificationTriggered,
  toggleDashboard,
  toggleEditorTextSize,
  toggleLibrary,
  toggleTopBarMenu,
} from '../actions';
import {
  signIn,
  signOut,
} from '../clients/firebase';

function mapStateToProps(state) {
  return {
    currentProjectKey: getCurrentProjectKey(state),
    currentUser: getCurrentUser(state),
    enabledLibraries: getEnabledLibraries(state),
    isHamburgerMenuActive: isDashboardOpen(state),
    isSnapshotInProgress: isSnapshotInProgress(state),
    isTextSizeLarge: isTextSizeLarge(state),
    isUserTyping: isUserTyping(state),
    openMenu: getOpenTopBarMenu(state),
    validationState: getCurrentValidationState(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onClickHamburgerMenu() {
      dispatch(toggleDashboard());
    },

    onClickMenu(menuKey) {
      dispatch(toggleTopBarMenu(menuKey));
    },

    onCreateSnapshot() {
      dispatch(createSnapshot());
    },

    onLibraryToggled(projectKey, libraryKey) {
      dispatch(toggleLibrary(projectKey, libraryKey));
    },

    onLogOut() {
      signOut();
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

    onToggleTextSize() {
      dispatch(toggleEditorTextSize());
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TopBar);
