import React from 'react';
import i18n from 'i18next-client';

export default function GistExportNotification(props) {
  return (
    <span>
      {i18n.t('notifications.gist-export-complete')}{' '}
      <a href={props.payload.url} target="_blank">
        {i18n.t('notifications.gist-export-link')}
      </a>
    </span>
  );
}

GistExportNotification.propTypes = {
  payload: React.PropTypes.object.isRequired,
  type: React.PropTypes.string.isRequired,
};
