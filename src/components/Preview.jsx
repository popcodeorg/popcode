"use strict";

var React = require('react');
var DOMParser = window.DOMParser;

var ProjectStore = require('../stores/ProjectStore');
var parser = new DOMParser();
var libraries = require('../config').libraries;

var Preview = React.createClass({
  getInitialState: function() {
    return {previewDocument: this._generateDocument()};
  },

  componentDidMount: function() {
    ProjectStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    ProjectStore.removeChangeListener(this._onChange);
  },

  render: function() {
    return (
      <div id="preview">
        <iframe id="preview-frame" srcDoc={this.state.previewDocument} />
      </div>
    );
  },

  _onChange: function() {
    this.setState({previewDocument: this._generateDocument()});
  },

  _getProject: function() {
    return ProjectStore.get(this.props.projectKey);
  },

  _generateDocument: function() {
    var project = this._getProject();

    if (project === undefined) {
      return '';
    }

    var previewDocument = parser.parseFromString(
      project.sources.html, 'text/html');

    var previewHead = previewDocument.head;
    var previewBody = previewDocument.body;

    project.enabledLibraries.forEach(function(libraryKey) {
      var library = libraries[libraryKey];
      var css = library.css;
      var javascript = library.javascript;
      if (css !== undefined) {
        var linkTag = previewDocument.createElement('link');
        linkTag.rel = 'stylesheet';
        linkTag.href = css;
        previewHead.appendChild(linkTag);
      }
      if (javascript !== undefined) {
        var scriptTag = previewDocument.createElement('script');
        scriptTag.src = javascript;
        previewBody.appendChild(scriptTag);
      }
    });

    var styleTag = previewDocument.createElement('style');
    styleTag.innerHTML = project.sources.css;
    previewHead.appendChild(styleTag);
    var scriptTag = previewDocument.createElement('script');
    scriptTag.innerHTML = project.sources.javascript;
    previewBody.appendChild(scriptTag);

    return previewDocument.documentElement.outerHTML;
  }
});

module.exports = Preview;
