import i18next from 'i18next';
import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

import GenericNotificationWithURL from './GenericNotificationWithURL';

export default function ProjectExportNotification({metadata}) {
  const url = metadata.get('url');
  const exportType = metadata.get('exportType');
  const linkText = i18next.t('notifications.project-export-link');
  const text = i18next.t(`notifications.${exportType}-export-complete`);

  return (
    <GenericNotificationWithURL linkText={linkText} text={text} url={url} />
  );
}

ProjectExportNotification.propTypes = {
  metadata: ImmutablePropTypes.contains({
    url: PropTypes.string.isRequired,
    exportType: PropTypes.string.isRequired,
  }).isRequired,
};
