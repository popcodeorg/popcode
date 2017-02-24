import React from 'react';
import {t} from 'i18next';

function gistUrlFromId(gistId) {
  return `https://gist.github.com/${gistId}`;
}

export default function GistImportError(props) {
  return (
    <span>
      {t('notifications.gist-import-error')}{' '}
      <a href={gistUrlFromId(props.payload.gistId)} target="_blank">
        {t('notifications.gist-import-link')}
      </a>
    </span>
  );
}

GistImportError.propTypes = {
  payload: React.PropTypes.object.isRequired,
  type: React.PropTypes.string.isRequired,
};
