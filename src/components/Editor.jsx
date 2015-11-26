var React = require('react');
var ReactDOM = require('react-dom');
var ACE = require('brace');
require('brace/mode/html');
require('brace/mode/css');
require('brace/mode/javascript');
require('brace/theme/monokai');

var Editor = React.createClass({
  propTypes: {
    projectKey: React.PropTypes.string.isRequired,
    source: React.PropTypes.string.isRequired,
    errors: React.PropTypes.array.isRequired,
    language: React.PropTypes.string.isRequired,
    onInput: React.PropTypes.func.isRequired,
  },

  componentDidMount: function() {
    this._setupEditor();
  },

  componentWillReceiveProps: function(nextProps) {
    if (nextProps.projectKey !== this.props.projectKey) {
      this._startNewSession(nextProps.source);
    } else if (nextProps.source !== this._editor.getValue()) {
      this._editor.setValue(nextProps.source);
    }

    this._editor.getSession().setAnnotations(nextProps.errors);
  },

  shouldComponentUpdate: function() {
    return false;
  },

  componentWillUnmount: function() {
    this._editor.destroy();
  },

  _jumpToLine: function(line, column) {
    this._editor.moveCursorTo(line, column);
    this._editor.focus();
  },

  _setupEditor: function() {
    var containerElement = ReactDOM.findDOMNode(this);
    this._editor = ACE.edit(containerElement);
    this._configureSession(this._editor.getSession());
  },

  _startNewSession: function(source) {
    var session = new ACE.EditSession(source);
    this._configureSession(session);
    this._editor.setSession(session);
    this._editor.moveCursorTo(0, 0);
  },

  _configureSession: function(session) {
    var language = this.props.language;
    session.setMode('ace/mode/' + language);
    session.setUseWorker(false);
    session.on('change', function() {
      this.props.onInput(this._editor.getValue());
    }.bind(this));
  },

  render: function() {
    return (
      <div className="editor">
        {this.props.source}
      </div>
    );
  },
});

module.exports = Editor;
