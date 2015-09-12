"use strict";

var React = require('react/addons');
var update = React.addons.update;
var _ = require('lodash');

var CurrentProjectStore = require('../stores/CurrentProjectStore');
var Editor = require('./Editor.jsx');
var Output = require('./Output.jsx');
var Toolbar = require('./Toolbar.jsx');
var Storage = require('../services/Storage');
var config = require('../config');

var Workspace = React.createClass({
  getInitialState: function() {
    return this._calculateState();
  },

  componentDidMount: function() {
    CurrentProjectStore.addChangeListener(this._onChange);
  },

  componentDidUnmount: function() {
    CurrentProjectStore.removeChangeListener(this._onChange);
  },

  render: function() {
    var environment;
    if (this.state.projectKey !== undefined) {
      environment = (
        <div className="environment">
          <Output
            projectKey={this.state.projectKey}
            enabledLibraries={this.state.enabledLibraries}
            onErrorClicked={this._onErrorClicked} />

          <Editor
            ref="htmlEditor"
            projectKey={this.state.projectKey}
            language="html" />

          <Editor
            ref="cssEditor"
            projectKey={this.state.projectKey}
            language="css" />

          <Editor
            ref="javascriptEditor"
            projectKey={this.state.projectKey}
            language="javascript" />
        </div>
      );
    }

    return (
      <div id="workspace">
        <Toolbar
          enabledLibraries={this.state.enabledLibraries}
          onNewProject={this._onNewProject}
          onProjectSelected={this._onProjectSelected}
          onLibraryToggled={this._onLibraryToggled} />
        {environment}
      </div>
    )
  },

  _onErrorClicked: function(language, line, column) {
    var editor = this.refs[language + 'Editor'];
    editor._jumpToLine(line, column);
  },

  _onNewProject: function() {
    this.setState(this._cleanProjectState());
  },

  _onProjectSelected: function(project) {
    this.setState(function(oldState) {
      return _.assign({}, this._cleanProjectState(), project.data, {
        projectKey: project.key
      })
    });
  },

  _onLibraryToggled: function(libraryKey) {
    this.setState(function(oldState) {
      var libraryIndex = oldState.enabledLibraries.indexOf(libraryKey);
      if (libraryIndex !== -1) {
        return update(oldState, {
          enabledLibraries: {$splice: [[libraryIndex, 1]]}
        });
      } else {
        return update(oldState, {enabledLibraries: {$push: [libraryKey]}});
      }
    });
  },

  _onChange: function() {
    this.setState(this._calculateState());
  },

  _calculateState: function() {
    return {projectKey: CurrentProjectStore.getKey()};
  }
});

module.exports = Workspace;
