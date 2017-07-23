import React from 'react';
import PropTypes from 'prop-types';
import partial from 'lodash/partial';
import NotificationContainer from './NotificationContainer';
import {
  GenericNotification,
  GistExportNotification,
  GistImportError,
  RepoExportNotification,
  SnapshotNotification,
} from './notifications';

const NOTIFICATION_COMPONENTS = {
  'gist-export-complete': GistExportNotification,
  'gist-import-error': GistImportError,
  'repo-export-complete': RepoExportNotification,
  'snapshot-created': SnapshotNotification,
};

function chooseNotificationComponent(notification) {
  if (notification.type in NOTIFICATION_COMPONENTS) {
    return NOTIFICATION_COMPONENTS[notification.type];
  }

  return GenericNotification;
}

export default function NotificationList({
  notifications,
  onNotificationDismissed,
  onUpdateNotificationMetadata,
}) {
  if (!notifications.length) {
    return null;
  }

  const notificationList = notifications.map((notification) => {
    const Notification = chooseNotificationComponent(notification);

    return (
      <NotificationContainer
        key={notification.type}
        severity={notification.severity}
        onDismissed={
          partial(onNotificationDismissed, notification)
        }
      >
        <Notification
          metadata={notification.metadata}
          payload={notification.payload}
          type={notification.type}
          onUpdateMetadata={
            partial(onUpdateNotificationMetadata, notification)
          }
        />
      </NotificationContainer>
    );
  });

  return (
    <div className="notification-list">{notificationList}</div>
  );
}

NotificationList.propTypes = {
  notifications: PropTypes.array.isRequired,
  onNotificationDismissed: PropTypes.func.isRequired,
  onUpdateNotificationMetadata: PropTypes.func.isRequired,
};
