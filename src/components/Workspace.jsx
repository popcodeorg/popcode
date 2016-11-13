import React from 'react';
import {connect} from 'react-redux';
import values from 'lodash/values';
import bindAll from 'lodash/bindAll';
import includes from 'lodash/includes';
import isEmpty from 'lodash/isEmpty';
import partial from 'lodash/partial';
import sortBy from 'lodash/sortBy';
import map from 'lodash/map';
import isError from 'lodash/isError';
import isString from 'lodash/isString';
import i18n from 'i18next-client';
import qs from 'qs';
import fs from 'fs';
import path from 'path';
import base64 from 'base64-js';
import {TextEncoder} from 'text-encoding';
import Bugsnag from '../util/Bugsnag';
import appFirebase from '../services/appFirebase';
import Gists from '../services/Gists';
import {EmptyGistError} from '../services/Gists';
import {openWindowWithWorkaroundForChromeClosingBug} from '../util';

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
  userTyped,
  userRequestedFocusedLine,
  editorFocusedRequestedLine,
  notificationTriggered,
  userDismissedNotification,
  exportingGist,
  bootstrap,
} from '../actions';

import {getCurrentProject, isPristineProject} from '../util/projectUtils';

import EditorContainer from './EditorContainer';
import Editor from './Editor';
import Output from './Output';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import NotificationList from './NotificationList';

const spinnerPage = base64.fromByteArray(
  new TextEncoder('utf-8').encode(
    fs.readFileSync(
      path.join(
        __dirname,
        '../../templates/github-export.html'
      )
    )
  )
);

function mapStateToProps(state) {
  const projects = sortBy(
    values(state.projects.toJS()),
    (project) => -project.updatedAt
  );

  return {
    allProjects: projects,
    currentProject: getCurrentProject(state),
    errors: state.errors.toJS(),
    runtimeErrors: state.runtimeErrors.toJS(),
    isUserTyping: state.ui.getIn(['editors', 'typing']),
    currentUser: state.user.toJS(),
    ui: state.ui.toJS(),
    clients: state.clients.toJS(),
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
      '_handleErrorClick',
      '_handleLibraryToggled',
      '_handleLogOut',
      '_handleNewProject',
      '_handleProjectSelected',
      '_handleRuntimeError',
      '_handleStartLogIn',
      '_handleToggleDashboard',
      '_handleRequestedLineFocused',
      '_handleNotificationDismissed',
      '_handleExportGist'
    );
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
      if (!isPristineProject(this.props.currentProject)) {
        event.returnValue = i18n.t('workspace.confirmations.unload-unsaved');
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
    this.props.dispatch(maximizeComponent(`editor.${language}`));
    this.props.dispatch(userRequestedFocusedLine(language, line, column));
  }

  _handleEditorInput(language, source) {
    this.props.dispatch(userTyped());

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
    const errorStates = map(values(this.props.errors), 'state');

    if (includes(errorStates, 'failed')) {
      if (this.props.isUserTyping) {
        return 'validating';
      }
      return 'failed';
    }

    if (includes(errorStates, 'validating')) {
      return 'validating';
    }

    return 'passed';
  }

  _renderOutput() {
    if (includes(this.props.ui.minimizedComponents, 'output')) {
      return null;
    }

    return (
      <Output
        errors={this.props.errors}
        project={this.props.currentProject}
        runtimeErrors={this.props.runtimeErrors}
        validationState={this._getOverallValidationState()}
        onClearRuntimeErrors={this._handleClearRuntimeErrors}
        onErrorClick={this._handleErrorClick}
        onMinimize={
          partial(this._handleComponentMinimized,
            'output')
        }
        onRuntimeError={this._handleRuntimeError}
      />
    );
  }

  _renderEditors() {
    if (this.props.currentProject === null) {
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
            requestedFocusedLine={this.props.ui.editors.requestedFocusedLine}
            source={this.props.currentProject.sources[language]}
            onInput={partial(this._handleEditorInput, language)}
            onRequestedLineFocused={this._handleRequestedLineFocused}
          />
        </EditorContainer>
      );
    });

    if (isEmpty(editors)) {
      return null;
    }

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
    ).catch((e) => {
      switch (e.code) {
        case 'USER_CANCELLED':
          this.props.dispatch(
            notificationTriggered('user-cancelled-auth')
          );
          break;
        default:
          this.props.dispatch(notificationTriggered('auth-error'));
          if (isError(e)) {
            Bugsnag.notifyException(e, e.code);
          } else if (isString(e)) {
            Bugsnag.notifyException(new Error(e));
          }
          break;
      }
    });
  }

  _handleNotificationDismissed(error) {
    this.props.dispatch(userDismissedNotification(error.type));
  }

  _handleLogOut() {
    appFirebase.unauth();
  }

  _handleRequestedLineFocused() {
    this.props.dispatch(editorFocusedRequestedLine());
  }

  _handleExportGist() {
    if (this.props.clients.gists.exportInProgress) {
      return;
    }

    if (!this.props.currentUser.authenticated) {
      // eslint-disable-next-line no-alert
      if (!confirm(i18n.t('workspace.confirmations.anonymous-gist-export'))) {
        return;
      }
    }

    const newWindow = openWindowWithWorkaroundForChromeClosingBug(
      `data:text/html;base64,${spinnerPage}`
    );

    const gistWillExport = Gists.createFromProject(
      this.props.currentProject,
      this.props.currentUser
    );
    this.props.dispatch(exportingGist(gistWillExport));

    gistWillExport.then((response) => {
      if (newWindow.closed) {
        this.props.dispatch(
          notificationTriggered(
            'gist-export-complete',
            'notice',
            {url: response.html_url}
          )
        );
      } else {
        newWindow.location.href = response.html_url;
      }
    }, (error) => {
      if (error instanceof EmptyGistError) {
        this.props.dispatch(notificationTriggered('empty-gist'));
        if (!newWindow.closed) {
          newWindow.close();
        }
        return Promise.resolve();
      }
      this.props.dispatch(notificationTriggered('gist-export-error'));
      if (!newWindow.closed) {
        newWindow.close();
      }
      return Promise.reject(error);
    });
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
          gistExportInProgress={this.props.clients.gists.exportInProgress}
          validationState={this._getOverallValidationState()}
          onExportGist={this._handleExportGist}
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
      <div>
        <NotificationList
          notifications={this.props.ui.notifications}
          onErrorDismissed={this._handleNotificationDismissed}
        />
        <div className="layout">
          {this._renderDashboard()}
          {this._renderSidebar()}
          <div className="layout-main" id="workspace">
            {this._renderEnvironment()}
          </div>
        </div>
      </div>
    );
  }
}

Workspace.propTypes = {
  allProjects: React.PropTypes.array,
  clients: React.PropTypes.object,
  currentProject: React.PropTypes.object,
  currentUser: React.PropTypes.object.isRequired,
  dispatch: React.PropTypes.func.isRequired,
  errors: React.PropTypes.object,
  isUserTyping: React.PropTypes.bool,
  runtimeErrors: React.PropTypes.array,
  ui: React.PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(Workspace);
