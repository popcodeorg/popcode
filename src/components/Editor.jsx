var React = require('react');
var ACE = require('brace');
require('brace/mode/html');
require('brace/mode/css');
require('brace/mode/javascript');
require('brace/theme/monokai');

var ProjectActions = require('../actions/ProjectActions');
var ProjectStore = require('../stores/ProjectStore');
var ErrorStore = require('../stores/ErrorStore');

var Editor = React.createClass({
  componentDidMount: function(containerElement) {
    this._setupEditor(containerElement);
    ProjectStore.addChangeListener(this._onChange);
    ErrorStore.addChangeListener(this._onChange);
  },

  componentDidUnmount: function() {
    this.editor.destroy();
    ProjectStore.removeChangeListener(this._onChange);
    ErrorStore.removeChangeListener(this._onChange);
  },

  componentWillReceiveProps: function(nextProps) {
    if (nextProps.projectKey !== this.props.projectKey) {
      this._startNewSession(this._getSource(nextProps.projectKey));
    }
  },

  shouldComponentUpdate: function() {
    return false;
  },

  render: function() {
    return (
      <div className="editor">
        {this._getSource()}
      </div>
    );
  },

  _jumpToLine: function(line, column) {
    this.editor.moveCursorTo(line, column);
    this.editor.focus();
  },

  _setupEditor: function() {
    this.editor = ACE.edit(this.getDOMNode());
    this._configureSession(this.editor.getSession());
  },

  _onChange: function() {
    var source = this._getSource();
    if (source && source !== this.editor.getValue()) {
      this._startNewSession(source);
    }
    var errors = ErrorStore.getErrors(this.props.projectKey);
    this.editor.getSession().setAnnotations(errors[this.props.language]);
  },

  _startNewSession: function(source) {
    var session = new ACE.EditSession(source);
    this._configureSession(session);
    this.editor.setSession(session);
    this.editor.moveCursorTo(0, 0);
  },

  _configureSession: function(session) {
    var language = this.props.language;
    session.setMode('ace/mode/' + language);
    session.setUseWorker(false);
    session.on('change', function() {
      ProjectActions.updateSource(
        this.props.projectKey,
        this.props.language,
        this.editor.getValue()
      );
    }.bind(this));
  },

  _getSource: function(projectKey) {
    projectKey = projectKey || this.props.projectKey;
    var project = ProjectStore.get(projectKey);
    if (project) {
      return project.sources[this.props.language];
    }
  },
});

module.exports = Editor;
