var React = require('react');
var DOMParser = window.DOMParser;

var parser = new DOMParser();
var libraries = require('../config').libraries;

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

var Preview = React.createClass({
  propTypes: {
    project: React.PropTypes.object.isRequired,
  },

  componentDidMount: function() {
    window.addEventListener('message', this._onRuntimeError);
  },

  componentWillUnmount: function() {
    window.removeEventListener('message', this._onRuntimeError);
  },

  _generateDocument: function() {
    var project = this.props.project;

    if (project === undefined) {
      return '';
    }

    var previewDocument = parser.parseFromString(
      project.sources.html,
      'text/html'
    );

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
    scriptTag.innerHTML =
      errorMessageScript + project.sources.javascript;
    previewBody.appendChild(scriptTag);

    return previewDocument.documentElement.outerHTML;
  },

  _onRuntimeError: function(message) {
  },

  _popOut: function() {
    var doc = this._generateDocument();
    var url = 'data:text/html;base64,' + btoa(doc);
    window.open(url, 'preview');
  },

  render: function() {
    return (
      <div className="preview">
        <div className="preview-popOutButton" onClick={this._popOut} />
        <iframe className="preview-frame" srcDoc={this._generateDocument()} />
      </div>
    );
  },
});

module.exports = Preview;
