var React = require('react');

var CurrentProjectStore = require('../stores/CurrentProjectStore');
var ErrorStore = require('../stores/ErrorStore');
var ProjectStore = require('../stores/ProjectStore');
var Editor = require('./Editor');
var Output = require('./Output');
var Toolbar = require('./Toolbar');

function calculateState() {
  var projectKey = CurrentProjectStore.getKey();
  var project;
  var errors;
  if (projectKey) {
    project = ProjectStore.get(projectKey);
    errors = ErrorStore.getErrors(projectKey);
  }

  return {
    projectKey: projectKey,
    project: project,
    errors: errors,
  };
}

var Workspace = React.createClass({
  getInitialState: function() {
    return calculateState();
  },

  componentDidMount: function() {
    CurrentProjectStore.addChangeListener(this._onChange);
    ProjectStore.addChangeListener(this._onChange);
    ErrorStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    CurrentProjectStore.removeChangeListener(this._onChange);
    ProjectStore.removeChangeListener(this._onChange);
    ErrorStore.removeChangeListener(this._onChange);
  },

  _onErrorClicked: function(language, line, column) {
    var editor = this.refs[language + 'Editor'];
    editor._jumpToLine(line, column);
  },

  _onChange: function() {
    this.setState(calculateState());
  },

  render: function() {
    var environment;
    if (this.state.project !== undefined) {
      environment = (
        <div className="environment">
          <Output
            enabledLibraries={this.state.enabledLibraries}
            onErrorClicked={this._onErrorClicked}
          />

          <Editor
            ref="htmlEditor"
            projectKey={this.state.projectKey}
            source={this.state.project.sources.html}
            errors={this.state.errors.html}
            language="html"
          />

          <Editor
            ref="cssEditor"
            projectKey={this.state.projectKey}
            source={this.state.project.sources.css}
            errors={this.state.errors.css}
            language="css"
          />

          <Editor
            ref="javascriptEditor"
            projectKey={this.state.projectKey}
            source={this.state.project.sources.javascript}
            errors={this.state.errors.javascript}
            language="javascript"
          />
        </div>
      );
    }

    return (
      <div id="workspace">
        <Toolbar />
        {environment}
      </div>
    );
  },
});

module.exports = Workspace;
