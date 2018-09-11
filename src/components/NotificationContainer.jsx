import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import {library} from '@fortawesome/fontawesome-svg-core';
import {faTimes} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

library.add(faTimes);

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
        onClick={props.onDismissed}
      >
        <FontAwesomeIcon icon="times" />
      </span>
    </div>
  );
}

NotificationContainer.propTypes = {
  children: PropTypes.node.isRequired,
  severity: PropTypes.string.isRequired,
  onDismissed: PropTypes.func.isRequired,
};
