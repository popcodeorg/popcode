import {faTimes} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

export default function NotificationContainer(props) {
  return (
    <div
      className={classnames(
        'notification-list__notification',
        `notification-list__notification_${props.severity}`,
      )}
    >
      {props.children}
      <span className="notification-list__dismiss" onClick={props.onDismissed}>
        <FontAwesomeIcon icon={faTimes} />
      </span>
    </div>
  );
}

NotificationContainer.propTypes = {
  children: PropTypes.node.isRequired,
  severity: PropTypes.string.isRequired,
  onDismissed: PropTypes.func.isRequired,
};
