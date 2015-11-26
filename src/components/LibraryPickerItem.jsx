var React = require('react');
var classnames = require('classnames');

var LibraryPickerItem = React.createClass({
  propTypes: {
    enabled: React.PropTypes.bool,
    library: React.PropTypes.object.isRequired,
    onLibraryToggled: React.PropTypes.func.isRequired,
  },

  render: function() {
    return (
      <li className={classnames(
        'toolbar-menu-item',
        {'toolbar-menu-item--active': this.props.enabled}
      )} onClick={this.props.onLibraryToggled}
      >
        {this.props.library.name}
      </li>
    );
  },
});

module.exports = LibraryPickerItem;
