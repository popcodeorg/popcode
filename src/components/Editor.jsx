"use strict";

var React = require('react');
var ACE = require('brace');
require('brace/mode/html');
require('brace/mode/css');
require('brace/mode/javascript');
require('brace/theme/monokai');

var ProjectActions = require('../actions/ProjectActions');
var ErrorStore = require('../stores/ErrorStore');

var Editor = React.createClass({
  componentDidMount: function(containerElement) {
    this._setupEditor(containerElement);
    ErrorStore.addChangeListener(this._onChange);
  },

  componentDidUnmount: function() {
    this.editor.destroy();
    ErrorStore.removeChangeListener(this._onChange);
  },

  componentWillReceiveProps: function(nextProps) {
    if (nextProps.source !== this.editor.getValue()) {
      this.editor.setValue(nextProps.source);
      this.editor.moveCursorTo(0, 0);
    }
  },

  shouldComponentUpdate: function(nextProps) {
    return false;
  },

  render: function() {
    return (
      <div className="editor">
        {this.props.source}
      </div>
    )
  },

  _jumpToLine: function(line, column) {
    this.editor.moveCursorTo(line, column);
    this.editor.focus();
  },

  _setupEditor: function(containerElement) {
    this.editor = ACE.edit(this.getDOMNode());
    var language = this.props.language;
    var session = this.editor.getSession();
    session.setMode('ace/mode/' + language);
    session.setUseWorker(false);
    this.editor.on('change', function() {
      ProjectActions.updateSource(
        this.props.projectKey,
        this.props.language,
        this.editor.getValue()
      );
      this.props.onChange(this.props.language, this.editor.getValue()); //FIXME remove
    }.bind(this));
  },

  _onChange: function() {
    var errors = ErrorStore.getErrors(this.props.projectKey)
    this.editor.getSession().setAnnotations(errors[this.props.language]);
  }
});

module.exports = Editor;
