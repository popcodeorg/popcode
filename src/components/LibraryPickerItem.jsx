import React from 'react';
import classnames from 'classnames';

class LibraryPickerItem extends React.Component {
  render() {
    return (
      <div className={classnames(
        'dashboard-menu-item',
        {'dashboard-menu-item--active': this.props.enabled}
      )} onClick={this.props.onLibraryToggled}
      >
        {this.props.library.name}
      </div>
    );
  }
}

LibraryPickerItem.propTypes = {
  enabled: React.PropTypes.bool,
  library: React.PropTypes.object.isRequired,
  onLibraryToggled: React.PropTypes.func.isRequired,
};

export default LibraryPickerItem;
