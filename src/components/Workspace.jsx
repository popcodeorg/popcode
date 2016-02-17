import React from 'react';
import {connect} from 'react-redux';
import values from 'lodash/values';
import flatten from 'lodash/flatten';
import isEmpty from 'lodash/isEmpty';

import actions from '../actions';

import Editor from './Editor';
import Output from './Output';
import Toolbar from './Toolbar';

function mapStateToProps(state) {
  var currentProject = state.projects.get(
    state.currentProject.get('projectKey')
  );

  var currentProjectJS;
  if (currentProject) {
    currentProjectJS = currentProject.toJS();
  }

  return {
    allProjects: values(state.projects.toJS()),
    currentProject: currentProjectJS,
    errors: state.errors.toJS(),
    runtimeErrors: state.runtimeErrors.toJS(),
    delayErrorDisplay: state.delayErrorDisplay,
  };
}

var Workspace = React.createClass({
  propTypes: {
    dispatch: React.PropTypes.func.isRequired,
    allProjects: React.PropTypes.array,
    currentProject: React.PropTypes.object,
    errors: React.PropTypes.object,
    runtimeErrors: React.PropTypes.array,
    delayErrorDisplay: React.PropTypes.bool,
  },

  componentWillMount: function() {
    this.props.dispatch(actions.loadCurrentProjectFromStorage());
    this.props.dispatch(actions.loadAllProjects());
  },

  _allJavaScriptErrors: function() {
    return this.props.errors.javascript.concat(this.props.runtimeErrors);
  },

  _onErrorClicked: function(language, line, column) {
    var editor = this.refs[language + 'Editor'];
    editor._jumpToLine(line, column);
  },

  _onEditorInput: function(language, source) {
    this.props.dispatch(
      actions.updateProjectSource(
        this.props.currentProject.projectKey,
        language,
        source
      )
    );
  },

  _onLibraryToggled: function(libraryKey) {
    this.props.dispatch(
      actions.toggleLibrary(
        this.props.currentProject.projectKey,
        libraryKey
      )
    );
  },

  _onNewProject: function() {
    this.props.dispatch(actions.createProject());
  },

  _onProjectSelected: function(project) {
    this.props.dispatch(actions.changeCurrentProject(project.projectKey));
  },

  _onRuntimeError: function(error) {
    this.props.dispatch(actions.addRuntimeError(error));
  },

  _clearRuntimeErrors: function() {
    this.props.dispatch(actions.clearRuntimeErrors());
  },

  render: function() {
    var environment;
    if (this.props.currentProject !== undefined) {
      environment = (
        <div className="environment">
          <Output
            project={this.props.currentProject}
            errors={this.props.errors}
            hasErrors={
              !isEmpty(flatten(values(this.props.errors)))
            }
            delayErrorDisplay={this.props.delayErrorDisplay}
            runtimeErrors={this.props.runtimeErrors}
            onErrorClicked={this._onErrorClicked}
            onRuntimeError={this._onRuntimeError}
            clearRuntimeErrors={this._clearRuntimeErrors}
          />

          <Editor
            ref="htmlEditor"
            projectKey={this.props.currentProject.projectKey}
            source={this.props.currentProject.sources.html}
            errors={this.props.errors.html}
            onInput={this._onEditorInput.bind(this, 'html')}
            language="html"
          />

          <Editor
            ref="cssEditor"
            projectKey={this.props.currentProject.projectKey}
            source={this.props.currentProject.sources.css}
            errors={this.props.errors.css}
            onInput={this._onEditorInput.bind(this, 'css')}
            language="css"
          />

          <Editor
            ref="javascriptEditor"
            projectKey={this.props.currentProject.projectKey}
            source={this.props.currentProject.sources.javascript}
            errors={this._allJavaScriptErrors()}
            onInput={this._onEditorInput.bind(this, 'javascript')}
            language="javascript"
          />
        </div>
      );
    }

    return (
      <div id="workspace">
        <Toolbar
          allProjects={this.props.allProjects}
          currentProject={this.props.currentProject}
          onLibraryToggled={this._onLibraryToggled}
          onNewProject={this._onNewProject}
          onProjectSelected={this._onProjectSelected}
        />
        {environment}
      </div>
    );
  },
});

module.exports = connect(mapStateToProps)(Workspace);
