import isError from 'lodash/isError';
import isString from 'lodash/isString';
import {connect} from 'react-redux';
import Bugsnag from '../util/Bugsnag';
import {TopBar} from '../components';
import {
  getCurrentUser,
  getCurrentValidationState,
  getOpenTopBarMenu,
  isDashboardOpen,
  isUserTyping,
} from '../selectors';
import {
  toggleTopBarMenu,
  notificationTriggered,
  toggleDashboard,
} from '../actions';
import {
  signIn,
  signOut,
} from '../clients/firebase';

function mapStateToProps(state) {
  return {
    currentUser: getCurrentUser(state),
    isHamburgerMenuActive: isDashboardOpen(state),
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
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TopBar);
