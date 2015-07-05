"use strict";

var React = require('react');
var Editor = require('./editor.jsx');
var Preview = require('./preview.jsx');
var config = require('./config.js');

var Workspace = React.createClass({
  getInitialState: function() {
    return config.defaults;
  },

  handleUpdate: function(language, data) {
    var newState = {};
    newState[language] = data;
    this.setState(newState);
  },

  render: function() {
    return (
      <div id="workspace">
        <Preview ref="preview"
          html={this.state.html}
          css={this.state.css}
          javascript={this.state.javascript} />

        <Editor language="html" value={this.state.html} onChange={this.handleUpdate} />
        <Editor language="css" value={this.state.css} onChange={this.handleUpdate} />
        <Editor language="javascript" value={this.state.javascript} onChange={this.handleUpdate} />
      </div>
    )
  }
});

module.exports = Workspace;
