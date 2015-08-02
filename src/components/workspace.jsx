"use strict";

var React = require('react');
var Editor = require('./editor.jsx');
var Output = require('./output.jsx');
var Validations = require('../validations');
var config = require('../config.js');

var Workspace = React.createClass({
  getInitialState: function() {
    return config.defaults;
  },

  handleUpdate: function(language, source) {
    var validate = Validations[language];
    validate(source).then(function(errors) {
      var newState = {};
      newState[language] = {
        source: source,
        errors: errors
      };
      this.setState(newState);
    }.bind(this));
  },

  onErrorClicked: function(language, line, column) {
    var editor = this.refs[language + 'Editor'];
    editor.jumpToLine(line, column);
  },

  render: function() {
    return (
      <div id="workspace">
        <Output code={this.state} onErrorClicked={this.onErrorClicked} />

        <Editor ref="htmlEditor" language="html" {...this.state.html} onChange={this.handleUpdate} />
        <Editor ref="cssEditor" language="css" {...this.state.css} onChange={this.handleUpdate} />
        <Editor ref="javascriptEditor" language="javascript" {...this.state.javascript} onChange={this.handleUpdate} />
      </div>
    )
  }
});

module.exports = Workspace;
