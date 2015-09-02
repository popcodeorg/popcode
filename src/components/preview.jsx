"use strict";

var React = require('react');
var DOMParser = window.DOMParser;
var parser = new DOMParser();

var libraries = require('../config').libraries;

var Preview = React.createClass({
  render: function() {
    return (
      <div id="preview">
        <iframe id="preview-frame" srcDoc={this._generateDocument()} ref="frame" />
      </div>
    );
  },

  _generateDocument: function() {
    var previewDocument = parser.parseFromString(
      this.props.sources.html, 'text/html');

    var previewHead = previewDocument.head;
    var previewBody = previewDocument.body;

    this.props.enabledLibraries.forEach(function(libraryKey) {
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
    styleTag.innerHTML = this.props.sources.css;
    previewHead.appendChild(styleTag);
    var scriptTag = previewDocument.createElement('script');
    scriptTag.innerHTML = this.props.sources.javascript;
    previewBody.appendChild(scriptTag);

    return previewDocument.documentElement.outerHTML;
  }
});

module.exports = Preview;
