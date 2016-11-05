import React from 'react';
import partial from 'lodash/partial';
import {GenericNotification} from './notifications';

export default function NotificationList(props) {
  if (!props.notifications.length) {
    return null;
  }

  const notificationList = props.notifications.map((notification) => (
    <GenericNotification
      key={notification}
      payload={notification.payload}
      severity={notification.severity}
      type={notification.type}
      onErrorDismissed={partial(props.onErrorDismissed, notification)}
    />
  ));

  return (
    <div className="notificationList">{notificationList}</div>
  );
}

NotificationList.propTypes = {
  notifications: React.PropTypes.array,
  onErrorDismissed: React.PropTypes.func,
};
