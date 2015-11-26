var React = require('react');
var classnames = require('classnames');

var ProjectActions = require('../actions/ProjectActions');
var config = require('../config');

var LibraryPickerItem = React.createClass({
  propTypes: {
    enabled: React.PropTypes.bool,
    libraryKey: React.PropTypes.string.isRequired,
    projectKey: React.PropTypes.string.isRequired,
  },

  _getLibrary: function() {
    return config.libraries[this.props.libraryKey];
  },

  _onClicked: function() {
    ProjectActions.toggleLibrary(this.props.projectKey, this.props.libraryKey);
  },

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
});

module.exports = LibraryPickerItem;
