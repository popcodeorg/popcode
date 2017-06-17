import React from 'react';
import PropTypes from 'prop-types';
import {t} from 'i18next';
import partial from 'lodash/partial';
import classnames from 'classnames';
import config from '../config';
import ProjectList from './ProjectList';

class Dashboard extends React.Component {
  _renderSubmenuToggleButton(submenu, label) {
    return (
      <div
        className={classnames(
          'dashboard__menu-item',
          'dashboard__menu-item_grid',
          {'dashboard__menu-item_active':
            this.props.activeSubmenu === submenu},
        )}
        onClick={partial(this.props.onSubmenuToggled, submenu)}
      >
        {t(`dashboard.menu.${label}`)}
      </div>
    );
  }

  _renderMenu() {
    let newProjectButton, loadProjectButton, exportRepoButton;
    if (this.props.currentUser.authenticated) {
      newProjectButton = (
        <div
          className="dashboard__menu-item dashboard__menu-item_grid"
          onClick={this.props.onNewProject}
        >
          {t('dashboard.menu.new-project')}
        </div>
      );
      loadProjectButton =
        this._renderSubmenuToggleButton('projectList', 'load-project');
    }

    if (this.props.isExperimental && this.props.currentUser.authenticated) {
      exportRepoButton = (
        <div
          className="dashboard__menu-item dashboard__menu-item_grid"
          onClick={this.props.onExportRepo}
        >
          {t('dashboard.menu.export-repo')}
        </div>
      );
    }

    return (
      <div className="dashboard__menu dashboard__menu_grid">
        {newProjectButton}
        {loadProjectButton}
        <div
          className={
            classnames(
              'dashboard__menu-item',
              'dashboard__menu-item_grid',
              {
                'dashboard__menu-item_spinner':
                  this.props.gistExportInProgress,
              },
            )
          }
          onClick={this.props.onExportGist}
        >
          {t('dashboard.menu.export-gist')}
        </div>
        <a
          className="dashboard__menu-item dashboard__menu-item_grid"
          href={config.feedbackUrl}
          rel="noopener noreferrer"
          target="_blank"
        >
          {t('dashboard.menu.send-feedback')}
        </a>
        {exportRepoButton}
      </div>
    );
  }

  _renderSubmenu() {
    if (this.props.activeSubmenu === 'projectList') {
      return this._renderProjects();
    }
    return null;
  }

  _renderProjects() {
    return (
      <ProjectList
        projectKeys={this.props.projectKeys}
      />
    );
  }

  _renderLinks() {
    return (
      <div className="dashboard__links">
        <a
          className="dashboard__link u__icon"
          href="https://github.com/popcodeorg/popcode"
          rel="noopener noreferrer"
          target="_blank"
        >&#xf09b;</a>
        <a
          className="dashboard__link u__icon"
          href="https://twitter.com/popcodeorg"
          rel="noopener noreferrer"
          target="_blank"
        >&#xf099;</a>
        <a
          className="dashboard__link u__icon"
          href="https://slack.popcode.org/"
          rel="noopener noreferrer"
          target="_blank"
        >&#xf198;</a>
      </div>
    );
  }

  render() {
    if (!this.props.isOpen) {
      return null;
    }

    const sidebarClassnames = classnames(
      'layout__dashboard',
      'dashboard',
      'u__flex-container',
      'u__flex-container_column',
    );

    return (
      <div className={sidebarClassnames}>
        {this._renderMenu()}
        {this._renderSubmenu()}
        <div className="dashboard__spacer" />
        {this._renderLinks()}
      </div>
    );
  }
}

Dashboard.propTypes = {
  activeSubmenu: PropTypes.string,
  currentUser: PropTypes.object.isRequired,
  gistExportInProgress: PropTypes.bool.isRequired,
  isExperimental: PropTypes.bool.isRequired,
  isOpen: PropTypes.bool.isRequired,
  projectKeys: PropTypes.array.isRequired,
  onExportGist: PropTypes.func.isRequired,
  onExportRepo: PropTypes.func.isRequired,
  onNewProject: PropTypes.func.isRequired,
  onSubmenuToggled: PropTypes.func.isRequired,
};

Dashboard.defaultProps = {
  activeSubmenu: null,
  currentProject: null,
};

export default Dashboard;
