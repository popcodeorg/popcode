"use strict";

var React = require('react/addons');
var update = React.addons.update;
var Editor = require('./editor.jsx');
var Output = require('./output.jsx');
var Validations = require('../validations');
var config = require('../config.js');

var Workspace = React.createClass({
  getInitialState: function() {
    return config.defaults;
  },

  updateLanguageState: function(language, languageUpdates) {
    var stateUpdatesForLanguage = {inputs: {}};
    stateUpdatesForLanguage.inputs[language] = languageUpdates;

    this.setState(function(oldState) {
      return update(oldState, stateUpdatesForLanguage);
    });
  },

  handleInputUpdate: function(language, source) {
    this.updateLanguageState(language, {
      $merge: {source: source, errors: []}
    });
    this.validateInput(language, source);
  },

  validateInput: function(language, source) {
    var validate = Validations[language];
    validate(source).then(function(errors) {
      this.updateLanguageState(language, {errors: {$set: errors}});
    }.bind(this));
  },

  onErrorClicked: function(language, line, column) {
    var editor = this.refs[language + 'Editor'];
    editor.jumpToLine(line, column);
  },

  render: function() {
    return (
      <div id="workspace">
        <Output inputs={this.state.inputs} onErrorClicked={this.onErrorClicked} />

        <Editor ref="htmlEditor" language="html" {...this.state.inputs.html} onChange={this.handleInputUpdate} />
        <Editor ref="cssEditor" language="css" {...this.state.inputs.css} onChange={this.handleInputUpdate} />
        <Editor ref="javascriptEditor" language="javascript" {...this.state.inputs.javascript} onChange={this.handleInputUpdate} />
      </div>
    )
  }
});

module.exports = Workspace;
