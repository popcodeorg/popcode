var React = require('react');
var Bowser = require('bowser');
var normalizeError = require('../util/normalizeError.js');

var generatePreview = require('../util/generatePreview.js');

var PreviewFrame = React.createClass({
  propTypes: {
    src: React.PropTypes.string.isRequired,
    frameWillRefresh: React.PropTypes.func.isRequired,
    onRuntimeError: React.PropTypes.func.isRequired,
  },

  componentDidMount: function() {
    window.addEventListener('message', this._onMessage);
  },

  componentWillReceiveProps: function(nextProps) {
    if (nextProps.src !== this.props.src) {
      this.props.frameWillRefresh();
    }
  },

  componentDidUpdate: function(prevProps) {
    if (prevProps.src !== this.props.src) {
      this._writeFrameContents();
    }
  },

  componentWillUnmount: function() {
    window.removeEventListener('message', this._onMessage);
  },

  _saveFrame: function(frame) {
    this.frame = frame;
    this._writeFrameContents();
  },

  _writeFrameContents: function() {
    if (!this.frame) {
      return;
    }

    var frameDocument = this.frame.contentDocument;
    frameDocument.open();
    frameDocument.write(this.props.src);
    frameDocument.close();
  },

  _runtimeErrorLineOffset: function() {
    if (Bowser.safari) {
      return 2;
    }

    var firstSourceLine = this.props.src.
      split('\n').indexOf(generatePreview.sourceDelimiter) + 2;

    return firstSourceLine - 1;
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

    var ErrorConstructor = window[data.error.name] || Error;
    var error = new ErrorConstructor(data.error.message);

    var normalizedError = normalizeError(error);

    this.props.onRuntimeError({
      text: normalizedError.message,
      raw: normalizedError.message,
      row: data.error.line - this._runtimeErrorLineOffset() - 1,
      column: data.error.column,
      type: 'error',
    });
  },

  render: function() {
    if (Bowser.safari || Bowser.msie) {
      return <iframe className="preview-frame" ref={this._saveFrame} />;
    }

    return (
      <iframe className="preview-frame" srcDoc={this.props.src} />
    );
  },
});

module.exports = PreviewFrame;
