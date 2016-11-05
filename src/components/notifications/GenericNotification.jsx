import React from 'react';
import i18n from 'i18next-client';
import classnames from 'classnames';

export default function GenericNotification(props) {
  return (
    <div
      className={
        classnames(
          'notificationList-notification',
          `notificationList-notification--${props.severity}`
        )
      }
    >
      {i18n.t(`notifications.${props.type}`, props.payload)}
      <span
        className="notificationList-notification-dismiss"
        onClick={props.onErrorDismissed}
      >&#xf00d;</span>
    </div>
  );
}

GenericNotification.propTypes = {
  payload: React.PropTypes.object,
  severity: React.PropTypes.string,
  type: React.PropTypes.string,
  onErrorDismissed: React.PropTypes.func,
};
