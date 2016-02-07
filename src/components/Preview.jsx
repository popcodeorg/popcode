var React = require('react');
var TextEncoder = require('text-encoding').TextEncoder;
var base64 = require('base64-js');

var PreviewFrame = require('./PreviewFrame');
var generatePreview = require('../util/generatePreview.js');

var Preview = React.createClass({
  propTypes: {
    project: React.PropTypes.object.isRequired,
    onRuntimeError: React.PropTypes.func.isRequired,
    clearRuntimeErrors: React.PropTypes.func.isRequired,
  },

  _generateDocument: function() {
    var project = this.props.project;

    if (project === undefined) {
      return '';
    }

    return generatePreview(project).documentElement.outerHTML;
  },

  _popOut: function() {
    var doc = this._generateDocument();
    var uint8array = new TextEncoder('utf-8').encode(doc);
    var base64encoded = base64.fromByteArray(uint8array);
    var url = 'data:text/html;charset=utf-8;base64,' + base64encoded;
    window.open(url, 'preview');
  },

  render: function() {
    return (
      <div className="preview">
        <div className="preview-popOutButton" onClick={this._popOut} />
        <PreviewFrame
          src={this._generateDocument()}
          onRuntimeError={this.props.onRuntimeError}
          frameWillRefresh={this.props.clearRuntimeErrors}
        />
      </div>
    );
  },
});

module.exports = Preview;
