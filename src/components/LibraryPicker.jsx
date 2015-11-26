var React = require('react');
var lodash = require('lodash');

var ProjectActions = require('../actions/ProjectActions');
var LibraryPickerItem = require('./LibraryPickerItem');
var config = require('../config');

var LibraryPicker = React.createClass({
  _isLibraryEnabled: function(libraryKey) {
    return this.props.enabledLibraries.indexOf(libraryKey) !== -1;
  },

  _onLibraryToggled: function(libraryKey) {
    ProjectActions.toggleLibrary(this.props.projectKey, libraryKey);
  },

  render: function() {
    var libraries = lodash.map(config.libraries, function(library, key) {
      return (
        <LibraryPickerItem
          library={library}
          enabled={this._isLibraryEnabled(key)}
          onLibraryToggled={this._onLibraryToggled.bind(this, key)}
        />
      );
    }.bind(this));

    return <ul className="toolbar-menu">{libraries}</ul>;
  },
});

module.exports = LibraryPicker;
