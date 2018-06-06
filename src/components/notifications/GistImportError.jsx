import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import {t} from 'i18next';

function gistUrlFromId(gistId) {
  return `https://gist.github.com/${gistId}`;
}

export default function GistImportError({metadata}) {
  return (
    <span>
      {t('notifications.gist-import-error')}{' '}
      <a
        href={gistUrlFromId(metadata.get('gistId'))}
        rel="noopener noreferrer"
        target="_blank"
      >
        {t('notifications.gist-import-link')}
      </a>
    </span>
  );
}

GistImportError.propTypes = {
  metadata: ImmutablePropTypes.contains({
    gistId: PropTypes.string,
  }).isRequired,
};
