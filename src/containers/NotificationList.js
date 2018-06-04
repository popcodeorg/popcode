import {connect} from 'react-redux';

import NotificationList from '../components/NotificationList';
import {
  updateNotificationMetadata,
  userDismissedNotification,
} from '../actions';
import {getNotifications} from '../selectors';

function mapStateToProps(state) {
  return {
    notifications: getNotifications(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onNotificationDismissed({type}) {
      dispatch(userDismissedNotification(type));
    },

    onUpdateNotificationMetadata({type}, metadata) {
      dispatch(updateNotificationMetadata(type, metadata));
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NotificationList);
