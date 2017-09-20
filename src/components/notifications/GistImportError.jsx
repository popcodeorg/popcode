import React from 'react';
import PropTypes from 'prop-types';
import {t} from 'i18next';

function gistUrlFromId(gistId) {
  return `https://gist.github.com/${gistId}`;
}

export default function GistImportError({payload: {gistId}}) {
  return (
    <span>
      {t('notifications.gist-import-error')}{' '}
      <a
        href={gistUrlFromId(gistId)}
        rel="noopener noreferrer"
        target="_blank"
      >
        {t('notifications.gist-import-link')}
      </a>
    </span>
  );
}

GistImportError.propTypes = {
  payload: PropTypes.object.isRequired,
};
