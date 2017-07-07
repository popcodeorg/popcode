import React from 'react';
import PropTypes from 'prop-types';
import {t} from 'i18next';
import GenericNotificationWithURL from './GenericNotificationWithURL';

export default function GistExportNotification({payload: {url}}) {
  return (
    <GenericNotificationWithURL
      text={t('notifications.gist-export-complete')}
      url={url}
      urlText={t('notifications.gist-export-link')}
    />
  );
}

GistExportNotification.propTypes = {
  payload: PropTypes.object.isRequired,
};
