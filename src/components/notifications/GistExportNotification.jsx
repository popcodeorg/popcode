import React from 'react';
import {t} from 'i18next';

export default function GistExportNotification(props) {
  return (
    <span>
      {t('notifications.gist-export-complete')}{' '}
      <a href={props.payload.url} target="_blank">
        {t('notifications.gist-export-link')}
      </a>
    </span>
  );
}

GistExportNotification.propTypes = {
  payload: React.PropTypes.object.isRequired,
  type: React.PropTypes.string.isRequired,
};
