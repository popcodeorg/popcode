import React from 'react';
import {connect} from 'react-redux';
import values from 'lodash/values';
import flatten from 'lodash/flatten';
import isEmpty from 'lodash/isEmpty';
import bindAll from 'lodash/bindAll';
import includes from 'lodash/includes';
import i18n from 'i18next-client';
import qs from 'qs';

import {
  addRuntimeError,
  changeCurrentProject,
  clearRuntimeErrors,
  createProject,
  updateProjectSource,
  toggleLibrary,
  minimizeComponent,
  maximizeComponent,
  bootstrap,
} from '../actions';

import Editor from './Editor';
import Output from './Output';
import Toolbar from './Toolbar';
import Sidebar from './Sidebar';

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
    ui: state.ui.toJS(),
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

  _allErrorsFor(language) {
    if (language === 'javascript') {
      return this.props.errors.javascript.concat(this.props.runtimeErrors);
    }

    return this.props.errors[language];
  }

  _onComponentMinimized(componentName) {
    this.props.dispatch(minimizeComponent(componentName));
  }

  _onComponentMaximized(componentName) {
    this.props.dispatch(maximizeComponent(componentName));
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

    const editors = [];
    ['html', 'css', 'javascript'].forEach((language) => {
      if (includes(this.props.ui.minimizedComponents, `editor.${language}`)) {
        return;
      }

      editors.push(
        <Editor
          key={language}
          ref={`${language}Editor`}
          projectKey={this.props.currentProject.projectKey}
          source={this.props.currentProject.sources[language]}
          errors={this._allErrorsFor(language)}
          onInput={this._onEditorInput.bind(this, language)}
          onMinimize={
            this._onComponentMinimized.bind(this, `editor.${language}`)
          }
          language={language}
        />
      );
    });

    return (
      <div className="environment-column editors">{editors}</div>
    );
  }

  _renderSidebar() {
    return (
      <div className="layout-sidebar">
        <Sidebar
          minimizedComponents={this.props.ui.minimizedComponents}
          onComponentMaximized={this._onComponentMaximized.bind(this)}
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
        {this._renderSidebar()}
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
  ui: React.PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(Workspace);
