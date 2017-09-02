import classnames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

export default function LibraryPickerItem({isEnabled, library}) {
  return (
    <span>
      <span className={classnames('u__icon', {u__invisible: !isEnabled})}>
        &#xf00c;{' '}
      </span>
      {library.name}
    </span>
  );
}

LibraryPickerItem.propTypes = {
  isEnabled: PropTypes.bool.isRequired,
  library: PropTypes.object.isRequired,
};
