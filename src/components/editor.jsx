"use strict";

var React = require('react');
var ACE = require('brace');
var Validations = require('./validations');
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

  shouldComponentUpdate: function(nextProps) {
    return nextProps.value !== this.editor.getValue();
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
        if (content !== this.editor.getValue()) {
          return;
        }

        session.setAnnotations(errors);
        if (errors.length === 0) {
          this.props.onChange(language, content);
        }
      }.bind(this));
    }.bind(this));
  },

  render: function() {
    return (
      <div className="editor">
        {this.props.value}
      </div>
    )
  }
});

module.exports = Editor;
