import React from 'react';
import i18n from 'i18next-client';
import Gists from '../services/Gists';
import ProjectList from './ProjectList';

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

  _renderMenu() {
    let newProjectButton, loadProjectButton;
    if (this.props.currentUser.authenticated) {
      newProjectButton = (
        <div
          className="dashboard-menu-item dashboard-menu-item--newProject"
          onClick={this._newProject.bind(this)}
        >
          {i18n.t('dashboard.menu.new-project')}
        </div>
      );

      loadProjectButton = (
        <div
          className="dashboard-menu-item dashboard-menu-item--loadProject"
          onClick={this.props.onProjectListToggled}
        >
          {i18n.t('dashboard.menu.load-project')}
        </div>
      );
    }

    return (
      <div className="dashboard-menu">
        {newProjectButton}
        {loadProjectButton}
        <div className="dashboard-menu-item dashboard-menu-item--libraries">
          {i18n.t('dashboard.menu.libraries')}
        </div>
        <div
          className="dashboard-menu-item dashboard-menu-item--gist"
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
    return null;
  }

  _renderProjects() {
    return (
      <div>
        <ProjectList
          projects={this.props.allProjects}
          onProjectSelected={this.props.onProjectSelected}
        />
      </div>
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
  currentProject: React.PropTypes.object.isRequired,
  allProjects: React.PropTypes.array.isRequired,
  activeSubmenu: React.PropTypes.string,
  onStartLogIn: React.PropTypes.func.isRequired,
  onLogOut: React.PropTypes.func.isRequired,
  onNewProject: React.PropTypes.func.isRequired,
  onProjectSelected: React.PropTypes.func.isRequired,
  onProjectListToggled: React.PropTypes.func.isRequired,
};

export default Dashboard;
