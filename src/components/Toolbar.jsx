import React from 'react';
import classnames from 'classnames';
import i18n from 'i18next-client';
import LibraryPicker from './LibraryPicker';
import ProjectList from './ProjectList';
import Gists from '../services/Gists';
import appFirebase from '../services/appFirebase';

class Toolbar extends React.Component {
  constructor() {
    super();
    this.state = {open: false};
  }

  _close() {
    this.setState({open: false, submenu: null});
  }

  _newProject() {
    this._close();
    this.props.onNewProject();
  }

  _loadProject() {
    this.setState({submenu: 'loadProject'});
  }

  _exportGist() {
    const newWindow = open('about:blank', 'gist');

    Gists.createFromProject(this.props.currentProject, this.props.currentUser).
      then((response) => {
        newWindow.location = response.html_url;
      });
  }

  _showHideLabel() {
    if (this.state.open) {
      return i18n.t('toolbar.hide');
    }
    return i18n.t('toolbar.show');
  }

  _toggleLibraryPicker() {
    return this.setState((oldState) => {
      if (oldState.submenu === 'libraries') {
        return {submenu: null};
      }
      return {submenu: 'libraries'};
    });
  }

  _renderSubmenu() {
    switch (this.state.submenu) {
      case 'libraries':
        return (
          <LibraryPicker
            projectKey={this.props.currentProject.projectKey}
            enabledLibraries={this.props.currentProject.enabledLibraries}
            onLibraryToggled={this.props.onLibraryToggled}
          />
        );
      case 'loadProject':
        return (
          <ProjectList
            projects={this.props.allProjects}
            onProjectSelected={this._onProjectSelected.bind(this)}
          />
        );
    }

    return null;
  }

  _toggleShowHideState() {
    this.setState((oldState) => {
      if (oldState.open) {
        return {open: false, submenu: null};
      }
      return {open: true};
    });
  }

  _onProjectSelected(project) {
    this.props.onProjectSelected(project);
    this._close();
  }

  _promptForLogin() {
    appFirebase.authWithOAuthPopup(
      'github',
      {remember: 'sessionOnly', scope: 'gist'}
    ).then(this._close.bind(this));
  }

  _logOut() {
    appFirebase.unauth();
    this._close();
  }

  _renderNewProjectButton() {
    if (!this.props.currentUser.authenticated) {
      return null;
    }

    return (
      <li
        onClick={this._newProject.bind(this)}
        className="toolbar-menu-item"
      >
        {i18n.t('toolbar.new-project')}
      </li>
    );
  }

  _renderLoadProjectButton() {
    if (this.props.allProjects.length === 1) {
      return null;
    }

    return (
      <li onClick={this._loadProject.bind(this)}
        className={classnames(
          'toolbar-menu-item',
          {'toolbar-menu-item--active':
            this.state.submenu === 'loadProject'}
        )}
      >
        {i18n.t('toolbar.load-project')}
      </li>
    );
  }

  _renderUserSessionToggle() {
    if (this.props.currentUser.authenticated) {
      return (
        <li
          onClick={this._logOut.bind(this)}
          className="toolbar-menu-item"
        >
          Log out
        </li>
      );
    }

    return (
      <li
        onClick={this._promptForLogin.bind(this)}
        className="toolbar-menu-item"
      >
        Log in with GitHub
      </li>
    );
  }

  _renderExportGistButton() {
    return (
      <li
        onClick={this._exportGist.bind(this)}
        className="toolbar-menu-item"
      >
        {i18n.t('toolbar.export-gist')}
      </li>
    );
  }

  _renderLibrariesButton() {
    return (
      <li onClick={this._toggleLibraryPicker.bind(this)}
        className={classnames(
          'toolbar-menu-item',
          {'toolbar-menu-item-active': this.state.submenu === 'libraries'}
        )}
      >
        {i18n.t('toolbar.libraries')}
      </li>
    );
  }

  _renderShowHideBar() {
    return (
      <div
        className="toolbar-showHide"
        onClick={this._toggleShowHideState.bind(this)}
      >
        {this._showHideLabel()}
      </div>
    );
  }

  _renderMenu() {
    if (!this.props.currentProject) {
      return null;
    }

    return (
      <ul
        className={classnames(
          'toolbar-menu',
          {
            'toolbar-menu--open': this.state.open,
            'toolbar-menu--closed': !this.state.open,
          }
        )}
      >
        {this._renderNewProjectButton()}
        {this._renderLoadProjectButton()}
        {this._renderUserSessionToggle()}
        {this._renderExportGistButton()}
        {this._renderLibrariesButton()}
      </ul>
    );
  }

  render() {
    return (
      <div className="toolbar">
        {this._renderShowHideBar()}
        {this._renderMenu()}
        {this._renderSubmenu()}
      </div>
    );
  }
}

Toolbar.propTypes = {
  currentUser: React.PropTypes.object.isRequired,
  currentProject: React.PropTypes.object,
  allProjects: React.PropTypes.array,
  onLibraryToggled: React.PropTypes.func.isRequired,
  onNewProject: React.PropTypes.func.isRequired,
  onProjectSelected: React.PropTypes.func.isRequired,
};

export default Toolbar;
