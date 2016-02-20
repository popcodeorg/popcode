import React from 'react';
import classnames from 'classnames';

class LibraryPickerItem extends React.Component {
  render() {
    return (
      <li className={classnames(
        'toolbar-menu-item',
        {'toolbar-menu-item--active': this.props.enabled}
      )} onClick={this.props.onLibraryToggled}
      >
        {this.props.library.name}
      </li>
    );
  }
}

LibraryPickerItem.propTypes = {
  enabled: React.PropTypes.bool,
  library: React.PropTypes.object.isRequired,
  onLibraryToggled: React.PropTypes.func.isRequired,
};

export default LibraryPickerItem;
