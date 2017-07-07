import React from 'react';
import PropTypes from 'prop-types';
import {t} from 'i18next';

export default function GistExportNotification({payload: {url}}) {
  return (
    <span>
      {t('notifications.gist-export-complete')}{' '}
      <a href={url} rel="noopener noreferrer" target="_blank">
        {t('notifications.gist-export-link')}
      </a>
    </span>
  );
}

GistExportNotification.propTypes = {
  payload: PropTypes.object.isRequired,
};
