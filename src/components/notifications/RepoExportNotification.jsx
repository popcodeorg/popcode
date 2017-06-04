import React from 'react';
import PropTypes from 'prop-types';
import {t} from 'i18next';
import GenericNotificationWithURL from './GenericNotificationWithURL';

export default function RepoExportNotification(props) {
  return (
    <GenericNotificationWithURL
      payload={props.payload}
      text={t('notifications.repo-export-complete')}
      type={props.type}
      urlText={t('notifications.gist-export-link')}
    />
  );
}

RepoExportNotification.propTypes = {
  payload: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired,
};
