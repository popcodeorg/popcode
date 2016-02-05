var lodash = require('lodash');
var DOMParser = window.DOMParser;
var parser = new DOMParser();

var libraries = require('../config').libraries;

var sourceDelimiter = '/*__POPCODESTART__*/';

function generatePreview(project) {
  return new PreviewGenerator(project).previewDocument;
}

generatePreview.sourceDelimiter = sourceDelimiter;

function PreviewGenerator(project) {
  this._project = project;
  this.previewDocument = parser.parseFromString(
    project.sources.html,
    'text/html'
  );
  this._previewHead = this.previewDocument.head;
  this.previewBody = this.previewDocument.body;

  this._attachLibraries();

  this._addCss();
  this._addErrorHandling();
  this._addJavascript();
}

var errorHandlerScript = '(' + (function() {
  window.onerror = function(fullMessage, _file, line, column, error) {
    var name, message;
    if (error) {
      name = error.name;
      message = error.message;
    } else {
      var components = fullMessage.split(': ', 2);
      if (components.length === 2) {
        name = components[0];
        message = components[1];
      } else {
        name = 'Error';
        message = fullMessage;
      }
    }

    window.parent.postMessage(JSON.stringify({
      type: 'org.popcode.error',
      error: {
        name: name,
        message: message,
        line: line,
        column: column,
      },
    }), '*');
  };
}.toString()) + '());';

lodash.assign(PreviewGenerator.prototype, {
  _addCss: function() {
    var styleTag = this.previewDocument.createElement('style');
    styleTag.innerHTML = this._project.sources.css;
    this._previewHead.appendChild(styleTag);
  },

  _addJavascript: function() {
    var scriptTag = this.previewDocument.createElement('script');
    scriptTag.innerHTML = '\n' +
      sourceDelimiter + '\n' +
      this._project.sources.javascript;
    this.previewBody.appendChild(scriptTag);

    return this.previewDocument.documentElement.outerHTML;
  },

  _addErrorHandling: function() {
    var scriptTag = this.previewDocument.createElement('script');
    scriptTag.innerHTML = errorHandlerScript;
    this.previewBody.appendChild(scriptTag);
  },

  _attachLibraries: function() {
    this._project.enabledLibraries.forEach(function(libraryKey) {
      var library = libraries[libraryKey];
      var css = library.css;
      var javascript = library.javascript;
      if (css !== undefined) {
        this._attachCssLibrary(css);
      }
      if (javascript !== undefined) {
        this._attachJavascriptLibrary(javascript);
      }
    });
  },

  _attachCssLibrary: function(css) {
    var linkTag = this.previewDocument.createElement('link');
    linkTag.rel = 'stylesheet';
    linkTag.href = css;
    this._previewHead.appendChild(linkTag);
  },

  _attachJavascriptLibrary: function(javascript) {
    var scriptTag = this.previewDocument.createElement('script');
    scriptTag.src = javascript;
    this.previewBody.appendChild(scriptTag);
  },
});

module.exports = generatePreview;
