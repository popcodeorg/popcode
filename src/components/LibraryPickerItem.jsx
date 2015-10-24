var React = require('react');
var classnames = require('classnames');

var ProjectActions = require('../actions/ProjectActions');
var config = require('../config');

var LibraryPickerItem = React.createClass({
  render: function() {
    var library = this._getLibrary();
    return (
      <li className={classnames(
        'toolbar-menu-item',
        {'toolbar-menu-item--active': this.props.enabled}
      )} onClick={this._onClicked}
      >
        {library.name}
      </li>
    );
  },

  _getLibrary: function() {
    return config.libraries[this.props.libraryKey];
  },

  _onClicked: function() {
    ProjectActions.toggleLibrary(this.props.projectKey, this.props.libraryKey);
  },
});

module.exports = LibraryPickerItem;
