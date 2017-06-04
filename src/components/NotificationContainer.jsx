import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

export default function NotificationContainer(props) {
  return (
    <div
      className={
        classnames(
          'notification-list__notification',
          `notification-list__notification_${props.severity}`,
        )
      }
    >
      {props.children}
      <span
        className="notification-list__dismiss"
        onClick={props.onErrorDismissed}
      >&#xf00d;</span>
    </div>
  );
}

NotificationContainer.propTypes = {
  children: PropTypes.node.isRequired,
  severity: PropTypes.string.isRequired,
  onErrorDismissed: PropTypes.func.isRequired,
};
