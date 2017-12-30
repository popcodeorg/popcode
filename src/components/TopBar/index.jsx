import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import partial from 'lodash/partial';
import Wordmark from '../../static/images/wordmark.svg';
import Pop from '../Pop';
import CurrentUser from './CurrentUser';
import HamburgerMenu from './HamburgerMenu';
import LibraryPicker from './LibraryPicker';
import NewProjectButton from './NewProjectButton';
import ProjectPicker from './ProjectPicker';
import SnapshotButton from './SnapshotButton';
import TextSize from './TextSize';

function uiVariants({validationState, isUserTyping}) {
  if (validationState === 'passed') {
    return {popVariant: 'neutral'};
  }
  if (validationState === 'validating') {
    return {popVariant: 'neutral', modifier: 'top-bar_yellow'};
  }
  if (validationState === 'validation-error' && isUserTyping) {
    return {popVariant: 'thinking', modifier: 'top-bar_yellow'};
  }
  return {popVariant: 'horns', modifier: 'top-bar_red'};
}

export default function TopBar({
  currentProjectKey,
  currentUser,
  enabledLibraries,
  isExperimental,
  isGistExportInProgress,
  isRepoExportInProgress,
  isClassroomExportInProgress,
  isUserAuthenticated,
  isUserTyping,
  isSnapshotInProgress,
  isTextSizeLarge,
  openMenu,
  projectKeys,
  validationState,
  onChangeCurrentProject,
  onClickMenu,
  onCloseMenu,
  onCreateNewProject,
  onCreateSnapshot,
  onExportGist,
  onExportRepo,
  onExportToClassroom,
  onLogOut,
  onStartLogIn,
  onToggleLibrary,
  onToggleTextSize,
}) {
  const {popVariant, modifier} = uiVariants({validationState, isUserTyping});

  return (
    <header className={classnames('top-bar', modifier)}>
      <div className="top-bar__logo-container">
        <Pop variant={popVariant} />
      </div>
      <div className="top-bar__wordmark-container">
        <Wordmark />
      </div>
      <LibraryPicker
        enabledLibraries={enabledLibraries}
        onToggleLibrary={partial(onToggleLibrary, currentProjectKey)}
      />
      <SnapshotButton
        isInProgress={isSnapshotInProgress}
        onClick={onCreateSnapshot}
      />
      <TextSize isLarge={isTextSizeLarge} onToggle={onToggleTextSize} />
      <div className="top-bar__spacer" />
      <NewProjectButton
        isUserAuthenticated={isUserAuthenticated}
        onClick={onCreateNewProject}
      />
      <ProjectPicker
        currentProjectKey={currentProjectKey}
        isUserAuthenticated={isUserAuthenticated}
        projectKeys={projectKeys}
        onChangeCurrentProject={onChangeCurrentProject}
      />
      <CurrentUser
        isOpen={openMenu === 'currentUser'}
        user={currentUser}
        onClick={partial(onClickMenu, 'currentUser')}
        onClose={partial(onCloseMenu, 'currentUser')}
        onLogOut={onLogOut}
        onStartLogIn={onStartLogIn}
      />
      <HamburgerMenu
        isClassroomExportInProgress={isClassroomExportInProgress}
        isExperimental={isExperimental}
        isGistExportInProgress={isGistExportInProgress}
        isOpen={openMenu === 'hamburger'}
        isRepoExportInProgress={isRepoExportInProgress}
        isUserAuthenticated={isUserAuthenticated}
        onClick={partial(onClickMenu, 'hamburger')}
        onExportGist={onExportGist}
        onExportRepo={onExportRepo}
        onExportToClassroom={onExportToClassroom}
      />
    </header>
  );
}

TopBar.propTypes = {
  currentProjectKey: PropTypes.string,
  currentUser: PropTypes.object.isRequired,
  enabledLibraries: PropTypes.arrayOf(PropTypes.string).isRequired,
  isClassroomExportInProgress: PropTypes.bool.isRequired,
  isExperimental: PropTypes.bool.isRequired,
  isGistExportInProgress: PropTypes.bool.isRequired,
  isRepoExportInProgress: PropTypes.bool.isRequired,
  isSnapshotInProgress: PropTypes.bool.isRequired,
  isTextSizeLarge: PropTypes.bool.isRequired,
  isUserAuthenticated: PropTypes.bool.isRequired,
  isUserTyping: PropTypes.bool.isRequired,
  openMenu: PropTypes.string,
  projectKeys: PropTypes.arrayOf(PropTypes.string).isRequired,
  validationState: PropTypes.string.isRequired,
  onChangeCurrentProject: PropTypes.func.isRequired,
  onClickMenu: PropTypes.func.isRequired,
  onCloseMenu: PropTypes.func.isRequired,
  onCreateNewProject: PropTypes.func.isRequired,
  onCreateSnapshot: PropTypes.func.isRequired,
  onExportGist: PropTypes.func.isRequired,
  onExportRepo: PropTypes.func.isRequired,
  onExportToClassroom: PropTypes.func.isRequired,
  onLogOut: PropTypes.func.isRequired,
  onStartLogIn: PropTypes.func.isRequired,
  onToggleLibrary: PropTypes.func.isRequired,
  onToggleTextSize: PropTypes.func.isRequired,
};

TopBar.defaultProps = {
  currentProjectKey: null,
  openMenu: null,
};
