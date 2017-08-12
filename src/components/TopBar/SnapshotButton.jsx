import classnames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

export default function SnapshotButton({isInProgress, onClick}) {
  return (
    <div
      className={classnames(
        'top-bar__menu-button',
        'top-bar__snapshot',
        {'top-bar__snapshot_in-progress': isInProgress},
      )}
      onClick={onClick}
    >
      Snapshot
    </div>
  );
}

SnapshotButton.propTypes = {
  isInProgress: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};
