import classnames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import {t} from 'i18next';

export default function SnapshotButton({isInProgress, onClick}) {
  return (
    <div
      className={classnames(
        'top-bar__menu-button',
        'top-bar__snapshot',
        'top-bar__menu-button--secondary',
        {'top-bar__snapshot_in-progress': isInProgress},
      )}
      onClick={onClick}
    >
      {t('top-bar.create-snapshot')}
    </div>
  );
}

SnapshotButton.propTypes = {
  isInProgress: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};
