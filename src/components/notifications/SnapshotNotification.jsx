import {faCheckCircle} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import i18next from 'i18next';
import partial from 'lodash-es/partial';
import PropTypes from 'prop-types';
import React from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import ImmutablePropTypes from 'react-immutable-proptypes';

import {createSnapshotUrl} from '../../util/exportUrls';

export default function SnapshotNotification({metadata, onUpdateMetadata}) {
  const uri = createSnapshotUrl(metadata.get('snapshotKey'));

  let checkmark;
  if (metadata.get('isCopied')) {
    checkmark = [' ', <FontAwesomeIcon icon={faCheckCircle} key="icon" />];
  }

  return (
    <span>
      {i18next.t('notifications.snapshot-created')}{' '}
      <CopyToClipboard
        text={uri}
        onCopy={partial(onUpdateMetadata, {isCopied: true})}
      >
        <span className="u__link">
          {i18next.t('notifications.click-to-copy')}
        </span>
      </CopyToClipboard>
      {checkmark}
    </span>
  );
}

SnapshotNotification.propTypes = {
  metadata: ImmutablePropTypes.contains({
    snapshotKey: PropTypes.string.isRequired,
    isCopied: PropTypes.bool,
  }).isRequired,
  onUpdateMetadata: PropTypes.func.isRequired,
};
