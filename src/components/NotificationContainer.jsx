import React from 'react';
import classnames from 'classnames';

export default function NotificationContainer(props) {
  return (
    <div
      className={
        classnames(
          'notification-list__notification',
          `notificationList__notification_${props.severity}`
        )
      }
    >
      {props.children}
      <span
        className="notificationList__dismiss"
        onClick={props.onErrorDismissed}
      >&#xf00d;</span>
    </div>
  );
}

NotificationContainer.propTypes = {
  children: React.PropTypes.node.isRequired,
  severity: React.PropTypes.string.isRequired,
  onErrorDismissed: React.PropTypes.func.isRequired,
};
