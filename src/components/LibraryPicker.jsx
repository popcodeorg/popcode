var React = require('react');
var lodash = require('lodash');

var ProjectStore = require('../stores/ProjectStore');
var CurrentProjectStore = require('../stores/CurrentProjectStore');
var ProjectActions = require('../actions/ProjectActions');
var LibraryPickerItem = require('./LibraryPickerItem');
var config = require('../config');

function calculateState() {
  var projectKey = CurrentProjectStore.getKey();
  var enabledLibraries = [];

  if (projectKey) {
    enabledLibraries =
      ProjectStore.get(projectKey).enabledLibraries;
  }

  return {
    projectKey: projectKey,
    enabledLibraries: enabledLibraries,
  };
}

var LibraryPicker = React.createClass({
  getInitialState: function() {
    return calculateState();
  },

  componentDidMount: function() {
    CurrentProjectStore.addChangeListener(this._onChange);
    ProjectStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    CurrentProjectStore.removeChangeListener(this._onChange);
    ProjectStore.removeChangeListener(this._onChange);
  },

  _onChange: function() {
    this.setState(calculateState());
  },

  _isLibraryEnabled: function(libraryKey) {
    return this.state.enabledLibraries.indexOf(libraryKey) !== -1;
  },

  _onLibraryToggled: function(libraryKey) {
    ProjectActions.toggleLibrary(this.state.projectKey, libraryKey);
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
