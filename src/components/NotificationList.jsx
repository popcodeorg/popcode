import React from 'react';
import i18n from 'i18next-client';
import partial from 'lodash/partial';
import classnames from 'classnames';

export default function NotificationList(props) {
  if (!props.notifications.length) {
    return null;
  }

  const notificationList = props.notifications.map((notification) => (
    <div
      className={
        classnames(
          'notificationList-notification',
          `notificationList-notification--${notification.severity}`
        )
      }
      key={notification}
    >
      {i18n.t(`notifications.${notification.type}`, notification.payload)}
      <span
        className="notificationList-notification-dismiss"
        onClick={partial(props.onErrorDismissed, notification)}
      >&#xf00d;</span>
    </div>
  ));

  return (
    <div className="notificationList">{notificationList}</div>
  );
}

NotificationList.propTypes = {
  notifications: React.PropTypes.array,
  onErrorDismissed: React.PropTypes.func,
};
