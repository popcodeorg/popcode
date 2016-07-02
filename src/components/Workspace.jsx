import React from 'react';
import {connect} from 'react-redux';
import values from 'lodash/values';
import bindAll from 'lodash/bindAll';
import includes from 'lodash/includes';
import partial from 'lodash/partial';
import sortBy from 'lodash/sortBy';
import map from 'lodash/map';
import i18n from 'i18next-client';
import qs from 'qs';
import appFirebase from '../services/appFirebase';

import {
  addRuntimeError,
  changeCurrentProject,
  clearRuntimeErrors,
  createProject,
  updateProjectSource,
  toggleLibrary,
  minimizeComponent,
  maximizeComponent,
  toggleDashboard,
  toggleDashboardSubmenu,
  bootstrap,
} from '../actions';

import EditorContainer from './EditorContainer';
import Editor from './Editor';
import Output from './Output';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';

function mapStateToProps(state) {
  const currentProject = state.projects.get(
    state.currentProject.get('projectKey')
  );

  let currentProjectJS;
  if (currentProject) {
    currentProjectJS = currentProject.toJS();
  }

  const projects = sortBy(
    values(state.projects.toJS()),
    (project) => -project.updatedAt
  );

  return {
    allProjects: projects,
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
    bindAll(
      this,
      '_confirmUnload',
      '_handleClearRuntimeErrors',
      '_handleComponentMaximized',
      '_handleComponentMinimized',
      '_handleDashboardSubmenuToggled',
      '_handleEditorInput',
      '_handleEditorMountedOrUnmounted',
      '_handleErrorClick',
      '_handleLibraryToggled',
      '_handleLogOut',
      '_handleNewProject',
      '_handleProjectSelected',
      '_handleRuntimeError',
      '_handleStartLogIn',
      '_handleToggleDashboard'
    );

    this.editors = {};
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
      return this.props.errors.javascript.items.
        concat(this.props.runtimeErrors);
    }

    return this.props.errors[language].items;
  }

  _handleComponentMinimized(componentName) {
    this.props.dispatch(minimizeComponent(componentName));
  }

  _handleComponentMaximized(componentName) {
    this.props.dispatch(maximizeComponent(componentName));
  }

  _handleErrorClick(language, line, column) {
    this.editors[language]._jumpToLine(line, column);
  }

  _handleEditorMountedOrUnmounted(language, editor) {
    this.editors[language] = editor;
  }

  _handleEditorInput(language, source) {
    this.props.dispatch(
      updateProjectSource(
        this.props.currentProject.projectKey,
        language,
        source
      )
    );
  }

  _handleLibraryToggled(libraryKey) {
    this.props.dispatch(
      toggleLibrary(
        this.props.currentProject.projectKey,
        libraryKey
      )
    );
  }

  _handleNewProject() {
    this.props.dispatch(createProject());
  }

  _handleProjectSelected(project) {
    this.props.dispatch(changeCurrentProject(project.projectKey));
  }

  _handleDashboardSubmenuToggled(submenu) {
    this.props.dispatch(toggleDashboardSubmenu(submenu));
  }

  _handleRuntimeError(error) {
    this.props.dispatch(addRuntimeError(error));
  }

  _handleClearRuntimeErrors() {
    this.props.dispatch(clearRuntimeErrors());
  }

  _getOverallValidationState() {
    if (this.props.delayErrorDisplay) {
      return 'validating';
    }

    const errorStates = map(values(this.props.errors), 'state');

    if (includes(errorStates, 'failed')) {
      return 'failed';
    }

    if (includes(errorStates, 'validating')) {
      return 'validating';
    }

    return 'passed';
  }

  _renderOutput() {
    return (
      <Output
        errors={this.props.errors}
        project={this.props.currentProject}
        runtimeErrors={this.props.runtimeErrors}
        validationState={this._getOverallValidationState()}
        onClearRuntimeErrors={this._handleClearRuntimeErrors}
        onErrorClick={this._handleErrorClick}
        onRuntimeError={this._handleRuntimeError}
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
        <EditorContainer
          key={language}
          language={language}
          source={this.props.currentProject.sources[language]}
          onMinimize={
            partial(this._handleComponentMinimized, `editor.${language}`)
          }
        >
          <Editor
            errors={this._allErrorsFor(language)}
            key={language}
            language={language}
            percentageOfHeight={1 / editors.length}
            projectKey={this.props.currentProject.projectKey}
            ref={partial(this._handleEditorMountedOrUnmounted, language)}
            source={this.props.currentProject.sources[language]}
            onInput={partial(this._handleEditorInput, language)}
          />
        </EditorContainer>
      );
    });

    return (
      <div className="environment-column editors">{editors}</div>
    );
  }

  _handleToggleDashboard() {
    this.props.dispatch(toggleDashboard());
  }

  _handleStartLogIn() {
    appFirebase.authWithOAuthPopup(
      'github',
      {remember: 'sessionOnly', scope: 'gist'}
    );
  }

  _handleLogOut() {
    appFirebase.unauth();
  }

  _renderDashboard() {
    if (!this.props.ui.dashboard.isOpen) {
      return null;
    }

    return (
      <div className="layout-dashboard">
        <Dashboard
          activeSubmenu={this.props.ui.dashboard.activeSubmenu}
          allProjects={this.props.allProjects}
          currentProject={this.props.currentProject}
          currentUser={this.props.currentUser}
          validationState={this._getOverallValidationState()}
          onLibraryToggled={this._handleLibraryToggled}
          onLogOut={this._handleLogOut}
          onNewProject={this._handleNewProject}
          onProjectSelected={this._handleProjectSelected}
          onStartLogIn={this._handleStartLogIn}
          onSubmenuToggled={this._handleDashboardSubmenuToggled}
        />
      </div>
    );
  }

  _renderSidebar() {
    return (
      <div className="layout-sidebar">
        <Sidebar
          dashboardIsOpen={this.props.ui.dashboard.isOpen}
          minimizedComponents={this.props.ui.minimizedComponents}
          validationState={this._getOverallValidationState()}
          onComponentMaximized={this._handleComponentMaximized}
          onToggleDashboard={this._handleToggleDashboard}
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

  render() {
    return (
      <div className="layout">
        {this._renderDashboard()}
        {this._renderSidebar()}
        <div className="layout-main" id="workspace">
          {this._renderEnvironment()}
        </div>
      </div>
    );
  }
}

Workspace.propTypes = {
  allProjects: React.PropTypes.array,
  currentProject: React.PropTypes.object,
  currentUser: React.PropTypes.object.isRequired,
  delayErrorDisplay: React.PropTypes.bool,
  dispatch: React.PropTypes.func.isRequired,
  errors: React.PropTypes.object,
  runtimeErrors: React.PropTypes.array,
  ui: React.PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(Workspace);
