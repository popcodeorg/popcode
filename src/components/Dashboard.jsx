import React from 'react';
import i18n from 'i18next';
import partial from 'lodash/partial';
import classnames from 'classnames';
import ProjectList from './ProjectList';
import LibraryPicker from './LibraryPicker';
import Pop from './Pop';
import config from '../config';

class Dashboard extends React.Component {
  _renderLoginState() {
    const currentUser = this.props.currentUser;

    if (currentUser.authenticated) {
      const name = currentUser.displayName;

      return (
        <div className="dashboard__session">
          <img
            className="dashboard__avatar"
            src={currentUser.avatarUrl}
          />
          <span className="dashboard__username">{name}</span>
          <span
            className="dashboard__log-in-out"
            onClick={this.props.onLogOut}
          >
            {i18n.t('dashboard.session.log-out-prompt')}
          </span>
        </div>
      );
    }
    return (
      <div className="dashboard__session">
        <span className="dashboard__username">
          {i18n.t('dashboard.session.not-logged-in')}
        </span>
        <span
          className="dashboard__log-in-out"
          onClick={this.props.onStartLogIn}
        >
          {i18n.t('dashboard.session.log-in-prompt')}
        </span>
      </div>
    );
  }

  _renderSubmenuToggleButton(submenu, label) {
    return (
      <div
        className={classnames(
          'dashboard__menu-item',
          'dashboard__menu-item_grid',
          {'dashboard__menu-item_active':
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
          className="dashboard__menu-item dashboard__menu-item_grid"
          onClick={this.props.onNewProject}
        >
          {i18n.t('dashboard.menu.new-project')}
        </div>
      );

      loadProjectButton =
        this._renderSubmenuToggleButton('projectList', 'load-project');
    }

    return (
      <div className="dashboard__menu dashboard__menu_grid">
        {newProjectButton}
        {loadProjectButton}
        {this._renderSubmenuToggleButton('libraryPicker', 'libraries')}
        <div
          className={
            classnames(
              'dashboard__menu-item',
              'dashboard__menu-item_grid',
              {'dashboard__menu-item_spinner': this.props.gistExportInProgress}
            )
          }
          onClick={this.props.onExportGist}
        >
          {i18n.t('dashboard.menu.export-gist')}
        </div>
        <a
          className="dashboard__menu-item dashboard__menu-item_grid"
          href={config.feedbackUrl}
          target="_blank"
        >
          {i18n.t('dashboard.menu.send-feedback')}
        </a>
      </div>
    );
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
          'dashboard__pop',
          {
            dashboard__pop_visible:
              this.props.validationState === validationState,
          }
        )}
      >
        <Pop variant={variant} />
      </div>
    );
  }

  _renderPop() {
    return (
      <div className="dashboard__pop-container">
        {this._renderPopSvg('neutral', 'passed')}
        {this._renderPopSvg('thinking', 'validating')}
        {this._renderPopSvg('horns', 'failed')}
      </div>
    );
  }

  _renderLinks() {
    return (
      <div className="dashboard__links">
        <a
          className="dashboard__link fontawesome"
          href="https://github.com/popcodeorg/popcode"
          target="_blank"
        >&#xf09b;</a>
        <a
          className="dashboard__link fontawesome"
          href="https://twitter.com/popcodeorg"
          target="_blank"
        >&#xf099;</a>
        <a
          className="dashboard__link fontawesome"
          href="https://slack.popcode.org/"
          target="_blank"
        >&#xf198;</a>
      </div>
    );
  }

  render() {
    const sidebarClassnames = classnames(
      'dashboard',
      'u__flex-container',
      'u__flex-container_column',
      {
        dashboard_yellow: this.props.validationState === 'validating',
        dashboard_red: this.props.validationState === 'failed',
      }
    );

    return (
      <div className={sidebarClassnames}>
        {this._renderLoginState()}
        {this._renderMenu()}
        {this._renderSubmenu()}
        <div className="dashboard__spacer" />
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
