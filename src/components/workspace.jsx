"use strict";

var React = require('react/addons');
var update = React.addons.update;
var _ = require('lodash');

var Editor = require('./editor.jsx');
var Output = require('./output.jsx');
var Validations = require('../validations');
var Storage = require('../services/storage');
var config = require('../config.js');

var Workspace = React.createClass({
  getInitialState: function() {
    return _.assign(config.defaults, {
      storageKey: this.generateStorageKey()
    });
  },

  componentDidMount: function() {
    Storage.load().then(function(payload) {
      if (payload !== undefined) {
        this.setState({
          storageKey: payload.key,
          sources: payload.data
        });
      }
    }.bind(this));
  },

  componentWillUpdate: function(_nextProps, nextState) {
    var anyChanged = false;

    for (var language in nextState.sources) {
      if (this.state.sources[language] !== nextState.sources[language]) {
        this.validateInput(language, nextState.sources[language]);
        anyChanged = true;
      }
    }

    if (anyChanged) {
      Storage.save(nextState.storageKey, nextState.sources);
    }
  },

  setSource: function(language, source) {
    var updateCommand = {sources: {}};
    updateCommand.sources[language] = {$set: source};

    this.setState(function(oldState) {
      return update(oldState, updateCommand);
    });
  },

  validateInput: function(language, source) {
    var validate = Validations[language];
    validate(source).then(function(errors) {
      var updateCommand = {errors: {}};
      updateCommand.errors[language] = {$set: errors};
      this.setState(function(oldState) {
        return update(oldState, updateCommand);
      });
    }.bind(this));
  },

  onErrorClicked: function(language, line, column) {
    var editor = this.refs[language + 'Editor'];
    editor.jumpToLine(line, column);
  },

  generateStorageKey: function() {
    var date = new Date();
    return (date.getTime() * 1000 + date.getMilliseconds()).toString();
  },

  render: function() {
    return (
      <div id="workspace">
        <Output sources={this.state.sources} errors={this.state.errors} onErrorClicked={this.onErrorClicked} />

        <Editor ref="htmlEditor" language="html" source={this.state.sources.html} errors={this.state.errors.html} onChange={this.setSource} />
        <Editor ref="cssEditor" language="css" source={this.state.sources.css} errors={this.state.errors.css} onChange={this.setSource} />
        <Editor ref="javascriptEditor" language="javascript" source={this.state.sources.javascript} errors={this.state.errors.javascript} onChange={this.setSource} />
      </div>
    )
  }
});

module.exports = Workspace;
