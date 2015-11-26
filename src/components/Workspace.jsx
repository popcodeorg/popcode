var React = require('react');

var CurrentProjectStore = require('../stores/CurrentProjectStore');
var ErrorStore = require('../stores/ErrorStore');
var ProjectStore = require('../stores/ProjectStore');
var ProjectActions = require('../actions/ProjectActions');
var Editor = require('./Editor');
var Output = require('./Output');
var Toolbar = require('./Toolbar');

function calculateState() {
  var projectKey = CurrentProjectStore.getKey();
  var currentProject, errors, hasErrors;

  if (projectKey) {
    currentProject = ProjectStore.get(projectKey);
    errors = ErrorStore.getErrors(projectKey);
    hasErrors = ErrorStore.anyErrors(projectKey);
  }

  return {
    allProjects: ProjectStore.all(),
    currentProject: currentProject,
    hasErrors: hasErrors,
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

  _onEditorInput: function(language, source) {
    ProjectActions.updateSource(
      this.state.currentProject.projectKey,
      language,
      source
    );
  },

  _onLibraryToggled: function(libraryKey) {
    ProjectActions.toggleLibrary(
      this.state.currentProject.projectKey,
      libraryKey
    );
  },

  render: function() {
    var environment;
    if (this.state.currentProject !== undefined) {
      environment = (
        <div className="environment">
          <Output
            project={this.state.currentProject}
            errors={this.state.errors}
            hasErrors={this.state.hasErrors}
            onErrorClicked={this._onErrorClicked}
          />

          <Editor
            ref="htmlEditor"
            projectKey={this.state.currentProject.projectKey}
            source={this.state.currentProject.sources.html}
            errors={this.state.errors.html}
            onInput={this._onEditorInput.bind(this, 'html')}
            language="html"
          />

          <Editor
            ref="cssEditor"
            projectKey={this.state.currentProject.projectKey}
            source={this.state.currentProject.sources.css}
            errors={this.state.errors.css}
            onInput={this._onEditorInput.bind(this, 'css')}
            language="css"
          />

          <Editor
            ref="javascriptEditor"
            projectKey={this.state.currentProject.projectKey}
            source={this.state.currentProject.sources.javascript}
            errors={this.state.errors.javascript}
            onInput={this._onEditorInput.bind(this, 'javascript')}
            language="javascript"
          />
        </div>
      );
    }

    return (
      <div id="workspace">
        <Toolbar
          allProjects={this.state.allProjects}
          currentProject={this.state.currentProject}
          onLibraryToggled={this._onLibraryToggled}
        />
        {environment}
      </div>
    );
  },
});

module.exports = Workspace;
