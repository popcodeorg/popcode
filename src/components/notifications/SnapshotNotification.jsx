import React from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import PropTypes from 'prop-types';
import {t} from 'i18next';

export default function SnapshotNotification({payload: {snapshotKey}}) {
  const uri = document.createElement('a');
  uri.setAttribute('href', '/');
  uri.search = `snapshot=${snapshotKey}`;

  return (
    <span>
      {t('notifications.snapshot-created')}{' '}
      <CopyToClipboard text={uri}>
        <span className="u__link">
          {t('notifications.click-to-copy')}
        </span>
      </CopyToClipboard>
    </span>
  );
}

SnapshotNotification.propTypes = {
  payload: PropTypes.object.isRequired,
};
