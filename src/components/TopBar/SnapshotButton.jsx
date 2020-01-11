import classnames from 'classnames';
import i18next from 'i18next';
import PropTypes from 'prop-types';
import React from 'react';

export default function SnapshotButton({isInProgress, onClick}) {
  return (
    <div
      className={classnames(
        'top-bar__menu-button',
        'top-bar__snapshot',
        'top-bar__menu-button_primary',
        {'top-bar__snapshot_in-progress': isInProgress},
      )}
      onClick={onClick}
    >
      {i18next.t('top-bar.create-snapshot')}
    </div>
  );
}

SnapshotButton.propTypes = {
  isInProgress: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};
