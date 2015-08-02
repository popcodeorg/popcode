"use strict";

var React = require('react');
var ACE = require('brace');
var Validations = require('../validations');
require('brace/mode/html');
require('brace/mode/css');
require('brace/mode/javascript');
require('brace/theme/monokai');

var Editor = React.createClass({
  componentDidMount: function(containerElement) {
    this.setupEditor(containerElement);
  },

  componentDidUpdate: function(_prevProps, _prevState, _prevContext, containerElement) {
    this.setupEditor(containerElement);
  },

  componentWillReceiveProps: function(nextProps) {
    if (nextProps.source !== this.editor.getValue()) {
      return;
    }

    this.editor.getSession().setAnnotations(nextProps.errors);
  },

  shouldComponentUpdate: function(nextProps) {
    return false;
  },

  setupEditor: function(containerElement) {
    this.editor = ACE.edit(this.getDOMNode());
    var language = this.props.language;
    var session = this.editor.getSession();
    session.setMode('ace/mode/' + language);
    session.setUseWorker(false);
    var validate = Validations[language];
    this.editor.on('change', function() {
      var content = this.editor.getValue();
      validate(content).then(function(errors) {
        this.props.onChange(language, {
          source: content,
          errors: errors
        });
      }.bind(this));
    }.bind(this));
  },

  render: function() {
    return (
      <div className="editor">
        {this.props.source}
      </div>
    )
  }
});

module.exports = Editor;
