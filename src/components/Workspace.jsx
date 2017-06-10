import React from 'react';
import PropTypes from 'prop-types';
import {DraggableCore} from 'react-draggable';
import {connect} from 'react-redux';
import get from 'lodash/get';
import values from 'lodash/values';
import bindAll from 'lodash/bindAll';
import includes from 'lodash/includes';
import isNull from 'lodash/isNull';
import partial from 'lodash/partial';
import sortBy from 'lodash/sortBy';
import map from 'lodash/map';
import isError from 'lodash/isError';
import isString from 'lodash/isString';
import {t} from 'i18next';
import qs from 'qs';
import {getNodeWidth, getNodeWidths} from '../util/resize';
import Bugsnag from '../util/Bugsnag';
import {
  onSignedIn,
  onSignedOut,
  signIn,
  signOut,
  startSessionHeartbeat,
} from '../clients/firebaseAuth';

import {
  changeCurrentProject,
  createProject,
  updateProjectSource,
  userAuthenticated,
  userLoggedOut,
  toggleLibrary,
  hideComponent,
  unhideComponent,
  toggleDashboard,
  toggleDashboardSubmenu,
  focusLine,
  editorFocusedRequestedLine,
  dragRowDivider,
  dragColumnDivider,
  startDragColumnDivider,
  stopDragColumnDivider,
  notificationTriggered,
  userDismissedNotification,
  exportGist,
  applicationLoaded,
} from '../actions';

import {getCurrentProject, isPristineProject} from '../util/projectUtils';

import EditorsColumn from './EditorsColumn';
import Output from './Output';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import NotificationList from './NotificationList';
import PopThrobber from './PopThrobber';

function mapStateToProps(state) {
  const projects = sortBy(
    values(state.get('projects').toJS()),
    project => -project.updatedAt,
  );

  return {
    allProjects: projects,
    currentProject: getCurrentProject(state),
    errors: state.get('errors').toJS(),
    isDraggingColumnDivider: state.getIn(
      ['ui', 'workspace', 'isDraggingColumnDivider'],
    ),
    isUserTyping: state.getIn(['ui', 'editors', 'typing']),
    editorsFlex: state.getIn(['ui', 'workspace', 'columnFlex']).toJS(),
    rowsFlex: state.getIn(['ui', 'workspace', 'rowFlex']).toJS(),
    currentUser: state.get('user').toJS(),
    ui: state.get('ui').toJS(),
    clients: state.get('clients').toJS(),
  };
}

class Workspace extends React.Component {
  constructor() {
    super();
    bindAll(
      this,
      '_confirmUnload',
      '_handleComponentUnhide',
      '_handleComponentHide',
      '_handleDashboardSubmenuToggled',
      '_handleDividerDrag',
      '_handleDividerStart',
      '_handleDividerStop',
      '_handleEditorInput',
      '_handleEditorsDividerDrag',
      '_handleErrorClick',
      '_handleLibraryToggled',
      '_handleLogOut',
      '_handleNewProject',
      '_handleProjectSelected',
      '_handleStartLogIn',
      '_handleToggleDashboard',
      '_handleRequestedLineFocused',
      '_handleNotificationDismissed',
      '_handleExportGist',
      '_storeDividerRef',
      '_storeColumnRef',
    );
    this.columnRefs = [null, null];
  }

  componentWillMount() {
    let gistId = null;
    let isExperimental = false;
    if (location.search) {
      const query = qs.parse(location.search.slice(1));
      if (query.gist) {
        gistId = query.gist;
      }
      isExperimental = Object.keys(query).includes('experimental');
    }
    history.replaceState({}, '', location.pathname);
    this.props.dispatch(applicationLoaded({gistId, isExperimental}));
    this._listenForAuthChange();
    startSessionHeartbeat();
  }

  componentDidMount() {
    addEventListener('beforeunload', this._confirmUnload);
  }

  componentWillUnmount() {
    removeEventListener('beforeunload', this._confirmUnload);
  }

  _confirmUnload(event) {
    if (!this.props.currentUser.authenticated) {
      const currentProject = this.props.currentProject;
      if (!isNull(currentProject) && !isPristineProject(currentProject)) {
        event.returnValue = t('workspace.confirmations.unload-unsaved');
      }
    }
  }

  _handleComponentHide(componentName) {
    this.props.dispatch(
      hideComponent(
        this.props.currentProject.projectKey,
        componentName,
      ),
    );
  }

  _handleComponentUnhide(componentName) {
    this.props.dispatch(
      unhideComponent(
        this.props.currentProject.projectKey,
        componentName,
      ),
    );
  }

  _handleErrorClick(language, line, column) {
    this.props.dispatch(focusLine(language, line, column));
  }

  _handleEditorInput(language, source) {
    this.props.dispatch(
      updateProjectSource(
        this.props.currentProject.projectKey,
        language,
        source,
      ),
    );
  }

  _handleLibraryToggled(libraryKey) {
    this.props.dispatch(
      toggleLibrary(
        this.props.currentProject.projectKey,
        libraryKey,
      ),
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

  _getOverallValidationState() {
    const errorStates = map(values(this.props.errors), 'state');

    if (includes(errorStates, 'validation-error')) {
      if (this.props.isUserTyping) {
        return 'validating';
      }
      return 'validation-error';
    }

    if (includes(errorStates, 'validating')) {
      return 'validating';
    }

    if (includes(errorStates, 'runtime-error')) {
      return 'runtime-error';
    }

    return 'passed';
  }

  _renderOutput() {
    const {
      currentProject: {hiddenUIComponents},
      errors,
      isDraggingColumnDivider,
      rowsFlex,
    } = this.props;
    return (
      <Output
        errors={errors}
        isDraggingColumnDivider={isDraggingColumnDivider}
        isHidden={includes(hiddenUIComponents, 'output')}
        style={{flex: rowsFlex[1]}}
        validationState={this._getOverallValidationState()}
        onHide={
          partial(this._handleComponentHide,
            'output')
        }
        onRef={partial(this._storeColumnRef, 1)}
      />
    );
  }

  _handleToggleDashboard() {
    this.props.dispatch(toggleDashboard());
  }

  _handleEditorsDividerDrag(data) {
    this.props.dispatch(dragRowDivider(data));
  }

  _listenForAuthChange() {
    onSignedIn(userCredential =>
      this.props.dispatch(userAuthenticated(userCredential)),
    );
    onSignedOut(() => this.props.dispatch(userLoggedOut()));
  }

  _handleStartLogIn() {
    signIn().catch((e) => {
      switch (e.code) {
        case 'auth/popup-closed-by-user':
          this.props.dispatch(notificationTriggered('user-cancelled-auth'));
          break;
        case 'auth/network-request-failed':
          this.props.dispatch(notificationTriggered('auth-network-error'));
          break;
        case 'auth/cancelled-popup-request':
          break;
        case 'auth/web-storage-unsupported':
          this.props.dispatch(
            notificationTriggered('auth-third-party-cookies-disabled'),
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
    signOut();
  }

  _handleRequestedLineFocused() {
    this.props.dispatch(editorFocusedRequestedLine());
  }

  _handleExportGist() {
    this.props.dispatch(exportGist());
  }

  _renderDashboard() {
    const {
      allProjects,
      clients,
      currentProject,
      currentUser,
      ui,
    } = this.props;

    if (!ui.dashboard.isOpen) {
      return null;
    }

    return (
      <div className="layout__dashboard">
        <Dashboard
          activeSubmenu={ui.dashboard.activeSubmenu}
          allProjects={allProjects}
          currentProject={currentProject}
          currentUser={currentUser}
          gistExportInProgress={
            get(clients, 'gists.lastExport.status') === 'waiting'
          }
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
    let hiddenComponents = [];
    if (!isNull(this.props.currentProject)) {
      hiddenComponents = this.props.currentProject.hiddenUIComponents;
    }
    return (
      <div className="layout__sidebar">
        <Sidebar
          dashboardIsOpen={this.props.ui.dashboard.isOpen}
          hiddenComponents={hiddenComponents}
          validationState={this._getOverallValidationState()}
          onComponentUnhide={this._handleComponentUnhide}
          onToggleDashboard={this._handleToggleDashboard}
        />
      </div>
    );
  }

  _storeColumnRef(index, column) {
    this.columnRefs[index] = column;
  }

  _storeDividerRef(divider) {
    this.dividerRef = divider;
  }

  _handleDividerStart() {
    this.props.dispatch(startDragColumnDivider());
  }

  _handleDividerStop() {
    this.props.dispatch(stopDragColumnDivider());
  }

  _handleDividerDrag(_, {deltaX, lastX, x}) {
    this.props.dispatch(dragColumnDivider({
      columnWidths: getNodeWidths(this.columnRefs),
      dividerWidth: getNodeWidth(this.dividerRef),
      deltaX,
      lastX,
      x,
    }));
  }

  _renderEnvironment() {
    const {
      currentProject,
      editorsFlex,
      errors,
      rowsFlex,
      ui,
    } = this.props;
    if (isNull(currentProject)) {
      return <PopThrobber message={t('workspace.loading')} />;
    }

    return (
      <div className="environment">
        <EditorsColumn
          currentProject={currentProject}
          editorsFlex={editorsFlex}
          errors={errors}
          style={{flex: rowsFlex[0]}}
          ui={ui}
          onComponentHide={this._handleComponentHide}
          onDividerDrag={this._handleEditorsDividerDrag}
          onEditorInput={this._handleEditorInput}
          onRef={partial(this._storeColumnRef, 0)}
          onRequestedLineFocused={this._handleRequestedLineFocused}
        />
        <DraggableCore
          onDrag={this._handleDividerDrag}
          onStart={this._handleDividerStart}
          onStop={this._handleDividerStop}
        >
          <div
            className="editors__column-divider"
            ref={this._storeDividerRef}
          />
        </DraggableCore>
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
          <div className="workspace layout__main">
            {this._renderEnvironment()}
          </div>
        </div>
      </div>
    );
  }
}

Workspace.propTypes = {
  allProjects: PropTypes.array.isRequired,
  clients: PropTypes.object.isRequired,
  currentProject: PropTypes.object,
  currentUser: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  editorsFlex: PropTypes.array.isRequired,
  errors: PropTypes.object.isRequired,
  isDraggingColumnDivider: PropTypes.bool.isRequired,
  isUserTyping: PropTypes.bool,
  rowsFlex: PropTypes.array.isRequired,
  ui: PropTypes.object.isRequired,
};

Workspace.defaultProps = {
  currentProject: null,
  isUserTyping: false,
};

export default connect(mapStateToProps)(Workspace);
