import React from 'react';
import PropTypes from 'prop-types';
import {t} from 'i18next';

export default function GistExportNotification(props) {
  return (
    <span>
      {t('notifications.gist-export-complete')}{' '}
      <a href={props.payload.url} rel="noopener noreferrer" target="_blank">
        {t('notifications.gist-export-link')}
      </a>
    </span>
  );
}

GistExportNotification.propTypes = {
  payload: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired,
};
