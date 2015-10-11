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
        <Toolbar projectKey={this.state.projectKey} />
        {environment}
      </div>
    )
  },

  _onErrorClicked: function(language, line, column) {
    var editor = this.refs[language + 'Editor'];
    editor._jumpToLine(line, column);
  },

  _onChange: function() {
    this.setState(this._calculateState());
  },

  _calculateState: function() {
    return {projectKey: CurrentProjectStore.getKey()};
  }
});

module.exports = Workspace;
