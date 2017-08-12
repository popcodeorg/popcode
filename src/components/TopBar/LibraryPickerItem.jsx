import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

export default function LibraryPickerItem({
  enabled,
  library,
  onLibraryToggled,
}) {
  return (
    <div
      className={classnames('top-bar__menu-item',
        {'top-bar__menu-item_active': enabled},
      )}
      onClick={onLibraryToggled}
    >
      <span className={classnames('u__icon', {u__invisible: !enabled})}>
        &#xf00c;{' '}
      </span>
      {library.name}
    </div>
  );
}

LibraryPickerItem.propTypes = {
  enabled: PropTypes.bool.isRequired,
  library: PropTypes.object.isRequired,
  onLibraryToggled: PropTypes.func.isRequired,
};
