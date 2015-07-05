"use strict";

var React = require('react');
var ACE = require('brace');
//FIXME why can't I require these in setupEditor?
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
    this.editor.getSession().setMode('ace/mode/' + language);
    this.editor.on('change', function() {
      var content = this.editor.getValue();
      this.props.onChange(this.props.language, content);
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
