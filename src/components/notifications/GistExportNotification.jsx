import React from 'react';
import PropTypes from 'prop-types';
import {t} from 'i18next';
import GenericNotificationWithURL from './GenericNotificationWithURL';

export default function GistExportNotification({payload: {url}}) {
  return (
    <GenericNotificationWithURL
      linkText={t('notifications.github-export-link')}
      text={t('notifications.gist-export-complete')}
      url={url}
    />
  );
}

GistExportNotification.propTypes = {
  payload: PropTypes.object.isRequired,
};
