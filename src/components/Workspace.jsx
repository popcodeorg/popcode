import React from 'react';
import {connect} from 'react-redux';
import values from 'lodash/values';
import flatten from 'lodash/flatten';
import isEmpty from 'lodash/isEmpty';
import bindAll from 'lodash/bindAll';
import i18n from 'i18next-client';
import qs from 'qs';

import {
  addRuntimeError,
  changeCurrentProject,
  clearRuntimeErrors,
  createProject,
  updateProjectSource,
  toggleLibrary,
  bootstrap,
} from '../actions';

import Editor from './Editor';
import Output from './Output';
import Toolbar from './Toolbar';

function mapStateToProps(state) {
  const currentProject = state.projects.get(
    state.currentProject.get('projectKey')
  );

  let currentProjectJS;
  if (currentProject) {
    currentProjectJS = currentProject.toJS();
  }

  return {
    allProjects: values(state.projects.toJS()),
    currentProject: currentProjectJS,
    errors: state.errors.toJS(),
    runtimeErrors: state.runtimeErrors.toJS(),
    delayErrorDisplay: state.delayErrorDisplay,
    currentUser: state.user.toJS(),
  };
}

class Workspace extends React.Component {
  constructor() {
    super();
    bindAll(this, '_confirmUnload');
  }

  componentWillMount() {
    let gistId;
    if (location.search) {
      const query = qs.parse(location.search.slice(1));
      gistId = query.gist;
    }
    history.replaceState({}, '', location.pathname);
    this.props.dispatch(bootstrap({gistId}));
  }

  componentDidMount() {
    addEventListener('beforeunload', this._confirmUnload);
  }

  componentWillUnmount() {
    removeEventListener('beforeunload', this._confirmUnload);
  }

  _confirmUnload(event) {
    if (!this.props.currentUser.authenticated) {
      if (this.props.currentProject.updatedAt) {
        event.returnValue = i18n.t('workspace.confirm-unload');
      }
    }
  }

  _allJavaScriptErrors() {
    return this.props.errors.javascript.concat(this.props.runtimeErrors);
  }

  _onErrorClicked(language, line, column) {
    const editor = this.refs[`${language}Editor`];
    editor._jumpToLine(line, column);
  }

  _onEditorInput(language, source) {
    this.props.dispatch(
      updateProjectSource(
        this.props.currentProject.projectKey,
        language,
        source
      )
    );
  }

  _onLibraryToggled(libraryKey) {
    this.props.dispatch(
      toggleLibrary(
        this.props.currentProject.projectKey,
        libraryKey
      )
    );
  }

  _onNewProject() {
    this.props.dispatch(createProject());
  }

  _onProjectSelected(project) {
    this.props.dispatch(changeCurrentProject(project.projectKey));
  }

  _onRuntimeError(error) {
    this.props.dispatch(addRuntimeError(error));
  }

  _clearRuntimeErrors() {
    this.props.dispatch(clearRuntimeErrors());
  }

  _renderOutput() {
    return (
      <Output
        project={this.props.currentProject}
        errors={this.props.errors}
        hasErrors={
          !isEmpty(flatten(values(this.props.errors)))
        }
        delayErrorDisplay={this.props.delayErrorDisplay}
        runtimeErrors={this.props.runtimeErrors}
        onErrorClicked={this._onErrorClicked.bind(this)}
        onRuntimeError={this._onRuntimeError.bind(this)}
        clearRuntimeErrors={this._clearRuntimeErrors.bind(this)}
      />
    );
  }

  _renderEditors() {
    if (this.props.currentProject === undefined) {
      return null;
    }

    return (
      <div className="environment-column editors">
        <Editor
          key="html"
          ref="htmlEditor"
          projectKey={this.props.currentProject.projectKey}
          source={this.props.currentProject.sources.html}
          errors={this.props.errors.html}
          onInput={this._onEditorInput.bind(this, 'html')}
          language="html"
        />

        <Editor
          key="css"
          ref="cssEditor"
          projectKey={this.props.currentProject.projectKey}
          source={this.props.currentProject.sources.css}
          errors={this.props.errors.css}
          onInput={this._onEditorInput.bind(this, 'css')}
          language="css"
        />

        <Editor
          key="javascript"
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

  _renderEnvironment() {
    return (
      <div className="environment">
        {this._renderEditors()}
        {this._renderOutput()}
      </div>
    );
  }

  _renderToolbar() {
    return (
      <Toolbar
        allProjects={this.props.allProjects}
        currentProject={this.props.currentProject}
        currentUser={this.props.currentUser}
        onLibraryToggled={this._onLibraryToggled.bind(this)}
        onNewProject={this._onNewProject.bind(this)}
        onProjectSelected={this._onProjectSelected.bind(this)}
      />
    );
  }

  render() {
    return (
      <div className="layout">
        <div className="layout-sidebar"/>
        <div id="workspace" className="layout-main">
          {this._renderToolbar()}
          {this._renderEnvironment()}
        </div>
      </div>
    );
  }
}

Workspace.propTypes = {
  currentUser: React.PropTypes.object.isRequired,
  dispatch: React.PropTypes.func.isRequired,
  allProjects: React.PropTypes.array,
  currentProject: React.PropTypes.object,
  errors: React.PropTypes.object,
  runtimeErrors: React.PropTypes.array,
  delayErrorDisplay: React.PropTypes.bool,
};

export default connect(mapStateToProps)(Workspace);
