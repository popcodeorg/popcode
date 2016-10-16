import React from 'react';
import Isvg from 'react-inlinesvg';
import i18n from 'i18next-client';
import bindAll from 'lodash/bindAll';
import partial from 'lodash/partial';
import classnames from 'classnames';
import ProjectList from './ProjectList';
import LibraryPicker from './LibraryPicker';
import config from '../config';

class Dashboard extends React.Component {
  constructor() {
    super();
    bindAll(this, '_handleNewProject');
  }

  _renderLoginState() {
    const currentUser = this.props.currentUser;

    if (currentUser.authenticated) {
      const name = currentUser.info.displayName || currentUser.info.username;

      return (
        <div className="dashboard-session">
          <img
            className="dashboard-session-avatar"
            src={currentUser.info.profileImageURL}
          />
          <span className="dashboard-session-name">{name}</span>
          <span
            className="dashboard-session-logInOut"
            onClick={this.props.onLogOut}
          >
            {i18n.t('dashboard.session.logOutPrompt')}
          </span>
        </div>
      );
    }
    return (
      <div className="dashboard-session">
        <span className="dashboard-session-name">
          {i18n.t('dashboard.session.notLoggedIn')}
        </span>
        <span
          className="dashboard-session-logInOut"
          onClick={this.props.onStartLogIn}
        >
          {i18n.t('dashboard.session.logInPrompt')}
        </span>
      </div>
    );
  }

  _renderSubmenuToggleButton(submenu, label) {
    return (
      <div
        className={classnames(
          'dashboard-menu-item',
          'dashboard-menu-item--grid',
          {'dashboard-menu-item--active':
            this.props.activeSubmenu === submenu}
        )}
        onClick={partial(this.props.onSubmenuToggled, submenu)}
      >
        {i18n.t(`dashboard.menu.${label}`)}
      </div>
    );
  }

  _renderMenu() {
    let newProjectButton, loadProjectButton;
    if (this.props.currentUser.authenticated) {
      newProjectButton = (
        <div
          className="dashboard-menu-item dashboard-menu-item--grid"
          onClick={this._handleNewProject}
        >
          {i18n.t('dashboard.menu.new-project')}
        </div>
      );

      loadProjectButton =
        this._renderSubmenuToggleButton('projectList', 'load-project');
    }

    return (
      <div className="dashboard-menu dashboard-menu--grid">
        {newProjectButton}
        {loadProjectButton}
        {this._renderSubmenuToggleButton('libraryPicker', 'libraries')}
        <div
          className={
            classnames(
              'dashboard-menu-item',
              'dashboard-menu-item--grid',
              {'dashboard-menu-item--spinner': this.props.gistExportInProgress}
            )
          }
          onClick={this.props.onExportGist}
        >
          {i18n.t('dashboard.menu.export-gist')}
        </div>
        <a
          className="dashboard-menu-item dashboard-menu-item--grid"
          href={config.feedbackUrl}
          target="_blank"
        >
          {i18n.t('dashboard.menu.send-feedback')}
        </a>
      </div>
    );
  }

  _handleNewProject() {
    this.props.onNewProject();
  }

  _renderSubmenu() {
    if (this.props.activeSubmenu === 'projectList') {
      return this._renderProjects();
    }
    if (this.props.activeSubmenu === 'libraryPicker') {
      return this._renderLibraryPicker();
    }
    return null;
  }

  _renderProjects() {
    return (
      <ProjectList
        currentProject={this.props.currentProject}
        projects={this.props.allProjects}
        onProjectSelected={this.props.onProjectSelected}
      />
    );
  }

  _renderLibraryPicker() {
    if (!this.props.currentProject) {
      return null;
    }

    return (
      <LibraryPicker
        enabledLibraries={this.props.currentProject.enabledLibraries}
        onLibraryToggled={this.props.onLibraryToggled}
      />
    );
  }

  _renderPopSvg(variant, validationState) {
    return (
      <div
        className={classnames(
          'dashboard-pop',
          {
            'dashboard-pop--visible':
              this.props.validationState === validationState,
          }
        )}
      >
        <Isvg src={`/images/pop/${variant}.svg`} />
      </div>
    );
  }

  _renderPop() {
    return (
      <div className="dashboard-popContainer">
        {this._renderPopSvg('neutral', 'passed')}
        {this._renderPopSvg('thinking', 'validating')}
        {this._renderPopSvg('horns', 'failed')}
      </div>
    );
  }

  _renderLinks() {
    return (
      <div className="dashboard-links">
        <a
          className="dashboard-links-link fontawesome"
          href="https://github.com/popcodeorg/popcode"
          target="_blank"
        >&#xf09b;</a>
        <a
          className="dashboard-links-link fontawesome"
          href="https://twitter.com/popcodeorg"
          target="_blank"
        >&#xf099;</a>
        <a
          className="dashboard-links-link fontawesome"
          href="https://join-popcode-slack.herokuapp.com/"
          target="_blank"
        >&#xf198;</a>
      </div>
    );
  }

  render() {
    const sidebarClassnames = classnames(
      'dashboard',
      'u-flexContainer',
      'u-flexContainer--column',
      {
        'dashboard--yellow': this.props.validationState === 'validating',
        'dashboard--red': this.props.validationState === 'failed',
      }
    );

    return (
      <div className={sidebarClassnames}>
        {this._renderLoginState()}
        {this._renderMenu()}
        {this._renderSubmenu()}
        <div className="dashboard-spacer" />
        {this._renderPop()}
        {this._renderLinks()}
      </div>
    );
  }
}

Dashboard.propTypes = {
  activeSubmenu: React.PropTypes.string,
  allProjects: React.PropTypes.array.isRequired,
  currentProject: React.PropTypes.object,
  currentUser: React.PropTypes.object.isRequired,
  gistExportInProgress: React.PropTypes.bool.isRequired,
  validationState: React.PropTypes.string.isRequired,
  onExportGist: React.PropTypes.func.isRequired,
  onLibraryToggled: React.PropTypes.func.isRequired,
  onLogOut: React.PropTypes.func.isRequired,
  onNewProject: React.PropTypes.func.isRequired,
  onProjectSelected: React.PropTypes.func.isRequired,
  onStartLogIn: React.PropTypes.func.isRequired,
  onSubmenuToggled: React.PropTypes.func.isRequired,
};

export default Dashboard;
