import React from 'react';
import classnames from 'classnames';

function LibraryPickerItem(props) {
  return (
    <div
      className={classnames(
        'dashboard__menu-item',
        {'dashboard__menu-item_active': props.enabled},
      )} onClick={props.onLibraryToggled}
    >
      {props.library.name}
    </div>
  );
}

LibraryPickerItem.propTypes = {
  enabled: React.PropTypes.bool,
  library: React.PropTypes.object.isRequired,
  onLibraryToggled: React.PropTypes.func.isRequired,
};

export default LibraryPickerItem;
