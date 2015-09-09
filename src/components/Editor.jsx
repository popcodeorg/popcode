"use strict";

var React = require('react');
var ACE = require('brace');
require('brace/mode/html');
require('brace/mode/css');
require('brace/mode/javascript');
require('brace/theme/monokai');

var ProjectActions = require('../actions/ProjectActions');

var Editor = React.createClass({
  componentDidMount: function(containerElement) {
    this._setupEditor(containerElement);
  },

  componentDidUpdate: function(_prevProps, _prevState, _prevContext, containerElement) {
    this.setupEditor(containerElement);
  },

  componentWillReceiveProps: function(nextProps) {
    if (nextProps.source !== this.editor.getValue()) {
      this.editor.setValue(nextProps.source);
      this.editor.moveCursorTo(0, 0);
    }

    this.editor.getSession().setAnnotations(nextProps.errors);
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
  }
});

module.exports = Editor;
