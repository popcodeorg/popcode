"use strict";

var React = require('react');
var Editor = require('./editor.jsx');
var Output = require('./output.jsx');
var config = require('../config.js');

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
        <Output {...this.state} />

        <Editor language="html" {...this.state.html} onChange={this.handleUpdate} />
        <Editor language="css" {...this.state.css} onChange={this.handleUpdate} />
        <Editor language="javascript" {...this.state.javascript} onChange={this.handleUpdate} />
      </div>
    )
  }
});

module.exports = Workspace;
