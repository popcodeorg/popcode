import React from 'react';
import PropTypes from 'prop-types';
import {t} from 'i18next';

import GenericNotificationWithURL from './GenericNotificationWithURL';

export default function ProjectExportNotification({payload}) {
  const {url, exportType} = payload;
  const linkText = t('notifications.project-export-link');
  const text = t(`notifications.${exportType}-export-complete`);

  return (
    <GenericNotificationWithURL
      linkText={linkText}
      text={text}
      url={url}
    />
  );
}

ProjectExportNotification.propTypes = {
  payload: PropTypes.object.isRequired,
};
