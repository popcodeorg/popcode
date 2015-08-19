"use strict";

var React = require('react');

var Preview = React.createClass({
  componentDidMount: function() {
    this.addCssAndJavascript();
  },

  componentDidUpdate: function() {
    this.addCssAndJavascript();
  },

  addCssAndJavascript: function() {
    var iframeElement = React.findDOMNode(this.refs.frame);
    var iframeDocument = iframeElement.contentWindow.document;
    var iframeHead = iframeDocument.head;
    var iframeBody = iframeDocument.body;

    this.props.enabledLibraries.forEach(function(library) {
      var css = library.css;
      var javascript = library.javascript;
      if (css !== undefined) {
        var linkTag = iframeDocument.createElement('link');
        linkTag.rel = 'stylesheet';
        linkTag.href = css;
        iframeHead.appendChild(linkTag);
      }
      if (javascript !== undefined) {
        var scriptTag = iframeDocument.createElement('script');
        scriptTag.src = javascript;
        iframeBody.appendChild(scriptTag);
      }
    });

    var styleTag = iframeDocument.createElement('style');
    styleTag.innerText = this.props.sources.css;
    iframeHead.appendChild(styleTag);
    var scriptTag = iframeDocument.createElement('script');
    scriptTag.innerText = this.props.sources.javascript;
    iframeBody.appendChild(scriptTag);
  },

  render: function() {
    return (
      <div id="preview">
        <iframe id="preview-frame" srcDoc={this.props.sources.html} ref="frame" />
      </div>
    );
  }
});

module.exports = Preview;
