import React from 'react';
import classnames from 'classnames';
import i18n from 'i18next-client';
import bindAll from 'lodash/bindAll';
import LibraryPicker from './LibraryPicker';
import ProjectList from './ProjectList';
import Gists from '../services/Gists';

class Toolbar extends React.Component {
  constructor() {
    super();
    this.state = {open: false};
    bindAll(this);
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

    Gists.createFromProject(this.props.currentProject).
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

  _getSubmenu() {
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
            onProjectSelected={this._onProjectSelected}
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

  render() {
    if (!this.props.currentProject) {
      return null;
    }

    const toolbarItemsClasses = ['toolbar-menu'];
    if (this.state.open) {
      toolbarItemsClasses.push('toolbar-menu--open');
    } else {
      toolbarItemsClasses.push('toolbar-menu--closed');
    }

    return (
      <div className="toolbar">
        <div
          className="toolbar-showHide"
          onClick={this._toggleShowHideState}
        >

          {this._showHideLabel()}
        </div>
        <ul className={classnames(
          'toolbar-menu',
          {
            'toolbar-menu--open': this.state.open,
            'toolbar-menu--closed': !this.state.open,
          }
        )}
        >
          <li onClick={this._newProject} className="toolbar-menu-item">
            {i18n.t('toolbar.new-project')}
          </li>
          <li onClick={this._loadProject}
            className={classnames(
              'toolbar-menu-item',
              {'toolbar-menu-item--active':
                this.state.submenu === 'loadProject'}
            )}
          >
            {i18n.t('toolbar.load-project')}
          </li>
          <li onClick={this._exportGist} className="toolbar-menu-item">
            {i18n.t('toolbar.export-gist')}
          </li>
          <li onClick={this._toggleLibraryPicker}
            className={classnames(
              'toolbar-menu-item',
              {'toolbar-menu-item-active': this.state.submenu === 'libraries'}
            )}
          >
            {i18n.t('toolbar.libraries')}
          </li>
        </ul>
        {this._getSubmenu()}
      </div>
    );
  }
}

Toolbar.propTypes = {
  currentProject: React.PropTypes.object,
  allProjects: React.PropTypes.array,
  onLibraryToggled: React.PropTypes.func.isRequired,
  onNewProject: React.PropTypes.func.isRequired,
  onProjectSelected: React.PropTypes.func.isRequired,
};

export default Toolbar;
