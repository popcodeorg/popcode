import i18next from 'i18next';
import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

function gistUrlFromId(gistId) {
  return `https://gist.github.com/${gistId}`;
}

export default function GistImportError({metadata}) {
  return (
    <span>
      {i18next.t('notifications.gist-import-error')}{' '}
      <a
        href={gistUrlFromId(metadata.get('gistId'))}
        rel="noopener noreferrer"
        target="_blank"
      >
        {i18next.t('notifications.gist-import-link')}
      </a>
    </span>
  );
}

GistImportError.propTypes = {
  metadata: ImmutablePropTypes.contains({
    gistId: PropTypes.string,
  }).isRequired,
};
