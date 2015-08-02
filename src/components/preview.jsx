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
    var styleTag = iframeDocument.createElement('style');
    styleTag.innerText = this.props.css;
    iframeHead.appendChild(styleTag);
    var scriptTag = iframeDocument.createElement('script');
    scriptTag.innerText = this.props.javascript;
    iframeBody.appendChild(scriptTag);
  },

  render: function() {
    return (
      <div id="preview">
        <iframe id="preview-frame" srcDoc={this.props.html} ref="frame" />
      </div>
    );
  }
});

module.exports = Preview;
