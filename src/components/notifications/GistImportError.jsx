import React from 'react';
import i18n from 'i18next-client';

function gistUrlFromId(gistId) {
  return `https://gist.github.com/${gistId}`;
}

export default function GistImportError(props) {
  return (
    <span>
      {i18n.t('notifications.gist-import-error')}{' '}
      <a href={gistUrlFromId(props.payload.gistId)} target="_blank">
        {i18n.t('notifications.gist-import-link')}
      </a>
    </span>
  );
}

GistImportError.propTypes = {
  payload: React.PropTypes.object.isRequired,
  type: React.PropTypes.string.isRequired,
};
