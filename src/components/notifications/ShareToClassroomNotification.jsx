import React from 'react';
import PropTypes from 'prop-types';
import {t} from 'i18next';
import GenericNotificationWithURL from './GenericNotificationWithURL';

export default function ShareToClassroomNotification({payload: {url}}) {
  return (
    <GenericNotificationWithURL
      linkText={t('notifications.share-to-classroom-link')}
      text={t('notifications.share-to-classroom-complete')}
      url={url}
    />
  );
}

ShareToClassroomNotification.propTypes = {
  payload: PropTypes.object.isRequired,
};
