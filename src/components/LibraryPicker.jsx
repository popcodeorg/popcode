var React = require('react');
var lodash = require('lodash');

var CurrentProjectStore = require('../stores/CurrentProjectStore');
var LibraryPickerItem = require('./LibraryPickerItem.jsx');
var ProjectStore = require('../stores/ProjectStore');
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

  render: function() {
    var libraries = lodash.map(config.libraries, function(library, key) {
      return (
        <LibraryPickerItem
          projectKey={this.state.projectKey}
          libraryKey={key}
          enabled={this._isLibraryEnabled(key)} />
      );
    }.bind(this));

    return <ul className="toolbar-menu">{libraries}</ul>;
  },

  _onChange: function() {
    this.setState(calculateState());
  },

  _isLibraryEnabled: function(libraryKey) {
    return this.state.enabledLibraries.indexOf(libraryKey) !== -1;
  },
});

module.exports = LibraryPicker;
