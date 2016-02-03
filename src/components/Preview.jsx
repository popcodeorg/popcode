var React = require('react');
var Bowser = require('bowser');
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

var sourceDelimiter = '/*__POPCODESTART__*/';

var Preview = React.createClass({
  propTypes: {
    project: React.PropTypes.object.isRequired,
    onRuntimeError: React.PropTypes.func.isRequired,
  },

  componentDidMount: function() {
    window.addEventListener('message', this._onMessage);
  },

  componentWillUnmount: function() {
    window.removeEventListener('message', this._onMessage);
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
    scriptTag.innerHTML = errorHandlerScript;
    previewBody.appendChild(scriptTag);

    scriptTag = previewDocument.createElement('script');
    scriptTag.innerHTML = "\n" + sourceDelimiter + '\n' + project.sources.javascript;
    previewBody.appendChild(scriptTag);

    return previewDocument.documentElement.outerHTML;
  },

  _onMessage: function(message) {
    if (typeof message.data !== 'string') {
      return;
    }

    var data;
    try {
      data = JSON.parse(message.data);
    } catch (_e) {
      return;
    }

    if (data.type !== 'org.popcode.error') {
      return;
    }

    this.props.onRuntimeError({
      text: data.error.message,
      raw: data.error.message,
      row: data.error.line - this._runtimeErrorLineOffset() - 1,
      column: data.error.column,
      type: 'error',
    });
  },

  _runtimeErrorLineOffset: function() {
    if (Bowser.safari) {
      return 2;
    }

    var firstSourceLine = this._generateDocument().
      split('\n').indexOf(sourceDelimiter) + 2;

    return firstSourceLine - 1;
  },

  _popOut: function() {
    var doc = this._generateDocument();
    var url = 'data:text/html;base64,' + btoa(doc);
    window.open(url, 'preview');
  },

  _addFrameContents: function(frame) {
    if (frame === null) {
      return;
    }

    var frameDocument = frame.contentDocument;
    frameDocument.open();
    frameDocument.write(this._generateDocument());
    frameDocument.close();
  },

  _buildFrameNode: function() {
    if (Bowser.safari || Bowser.msie) {
      return <iframe className="preview-frame" ref={this._addFrameContents} />;
    }

    return (
      <iframe className="preview-frame" srcDoc={this._generateDocument()} />
    );
  },

  render: function() {
    return (
      <div className="preview">
        <div className="preview-popOutButton" onClick={this._popOut} />
        {this._buildFrameNode()}
      </div>
    );
  },
});

module.exports = Preview;
