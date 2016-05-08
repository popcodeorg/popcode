import React from 'react';
import i18n from 'i18next-client';
import partial from 'lodash/partial';
import classnames from 'classnames';
import Gists from '../services/Gists';
import ProjectList from './ProjectList';
import LibraryPicker from './LibraryPicker';

class Dashboard extends React.Component {
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
          onClick={this._newProject.bind(this)}
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
          className="dashboard-menu-item dashboard-menu-item--grid"
          onClick={this._exportGist.bind(this)}
        >
          {i18n.t('dashboard.menu.export-gist')}
        </div>
      </div>
    );
  }

  _newProject() {
    this.props.onNewProject();
  }

  _exportGist() {
    const newWindow = open('about:blank', 'gist');

    Gists.createFromProject(this.props.currentProject, this.props.currentUser).
      then((response) => {
        newWindow.location = response.html_url;
      });
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
        projects={this.props.allProjects}
        currentProject={this.props.currentProject}
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

  _renderPop() {
  }

  render() {
    return (
      <div className="dashboard u-flexContainer u-flexContainer--column">
        {this._renderLoginState()}
        {this._renderMenu()}
        {this._renderSubmenu()}
        {this._renderPop()}
      </div>
    );
  }
}

Dashboard.propTypes = {
  currentUser: React.PropTypes.object.isRequired,
  currentProject: React.PropTypes.object,
  allProjects: React.PropTypes.array.isRequired,
  activeSubmenu: React.PropTypes.string,
  onStartLogIn: React.PropTypes.func.isRequired,
  onLogOut: React.PropTypes.func.isRequired,
  onNewProject: React.PropTypes.func.isRequired,
  onProjectSelected: React.PropTypes.func.isRequired,
  onSubmenuToggled: React.PropTypes.func.isRequired,
  onLibraryToggled: React.PropTypes.func.isRequired,
};

export default Dashboard;
