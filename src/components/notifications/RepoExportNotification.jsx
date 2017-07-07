import React from 'react';
import PropTypes from 'prop-types';
import {t} from 'i18next';
import GenericNotificationWithURL from './GenericNotificationWithURL';

export default function RepoExportNotification({payload: {url}}) {
  return (
    <GenericNotificationWithURL
      text={t('notifications.repo-export-complete')}
      url={url}
      urlText={t('notifications.gist-export-link')}
    />
  );
}

RepoExportNotification.propTypes = {
  payload: PropTypes.object.isRequired,
};
