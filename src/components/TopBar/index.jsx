import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import partial from 'lodash-es/partial';

import Wordmark from '../../static/images/wordmark.svg';
import Pop from '../Pop';
import {UserAccount} from '../../records';

import CurrentUser from './CurrentUser';
import ExportMenu from './ExportMenu';
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
  hasInstructions,
  hasExportedRepo,
  isEditingInstructions,
  isExperimental,
  isGapiReady,
  isGistExportInProgress,
  isRepoExportInProgress,
  isClassroomExportInProgress,
  isUserAnonymous,
  isUserAuthenticated,
  isUserAuthenticatedWithGithub,
  isUserTyping,
  isSnapshotInProgress,
  isTextSizeLarge,
  openMenu,
  projectKeys,
  shouldShowSavedIndicator,
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
  onStartGithubLogIn,
  onStartGoogleLogIn,
  onStartEditingInstructions,
  onToggleLibrary,
  onToggleTextSize,
  onUpdateRepo,
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
      <ExportMenu
        hasExportedRepo={hasExportedRepo}
        isClassroomExportInProgress={isClassroomExportInProgress}
        isGistExportInProgress={isGistExportInProgress}
        isOpen={openMenu === 'export'}
        isRepoExportInProgress={isRepoExportInProgress}
        isUserAuthenticatedWithGithub={isUserAuthenticatedWithGithub}
        onClick={partial(onClickMenu, 'export')}
        onExportGist={onExportGist}
        onExportRepo={onExportRepo}
        onExportToClassroom={onExportToClassroom}
        onUpdateRepo={onUpdateRepo}
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
        shouldShowSavedIndicator={shouldShowSavedIndicator}
        onChangeCurrentProject={onChangeCurrentProject}
      />
      <CurrentUser
        isOpen={openMenu === 'currentUser'}
        isUserAnonymous={isUserAnonymous}
        isUserAuthenticated={isUserAuthenticated}
        user={currentUser}
        onClick={partial(onClickMenu, 'currentUser')}
        onClose={partial(onCloseMenu, 'currentUser')}
        onLogOut={onLogOut}
        onStartLogIn={onStartGithubLogIn}
      />
      <HamburgerMenu
        hasInstructions={hasInstructions}
        isEditingInstructions={isEditingInstructions}
        isExperimental={isExperimental}
        isGapiReady={isGapiReady}
        isOpen={openMenu === 'hamburger'}
        isUserAuthenticated={isUserAuthenticated}
        onClick={partial(onClickMenu, 'hamburger')}
        onStartEditingInstructions={
          partial(onStartEditingInstructions, currentProjectKey)}
        onStartGoogleLogIn={onStartGoogleLogIn}
      />
    </header>
  );
}

TopBar.propTypes = {
  currentProjectKey: PropTypes.string,
  currentUser: PropTypes.instanceOf(UserAccount),
  enabledLibraries: PropTypes.arrayOf(PropTypes.string).isRequired,
  hasExportedRepo: PropTypes.bool.isRequired,
  hasInstructions: PropTypes.bool.isRequired,
  isClassroomExportInProgress: PropTypes.bool.isRequired,
  isEditingInstructions: PropTypes.bool.isRequired,
  isExperimental: PropTypes.bool,
  isGapiReady: PropTypes.bool.isRequired,
  isGistExportInProgress: PropTypes.bool.isRequired,
  isRepoExportInProgress: PropTypes.bool.isRequired,
  isSnapshotInProgress: PropTypes.bool.isRequired,
  isTextSizeLarge: PropTypes.bool.isRequired,
  isUserAnonymous: PropTypes.bool.isRequired,
  isUserAuthenticated: PropTypes.bool.isRequired,
  isUserAuthenticatedWithGithub: PropTypes.bool.isRequired,
  isUserTyping: PropTypes.bool.isRequired,
  openMenu: PropTypes.string,
  projectKeys: PropTypes.arrayOf(PropTypes.string).isRequired,
  shouldShowSavedIndicator: PropTypes.bool.isRequired,
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
  onStartEditingInstructions: PropTypes.func.isRequired,
  onStartGithubLogIn: PropTypes.func.isRequired,
  onStartGoogleLogIn: PropTypes.func.isRequired,
  onToggleLibrary: PropTypes.func.isRequired,
  onToggleTextSize: PropTypes.func.isRequired,
  onUpdateRepo: PropTypes.func.isRequired,
};

TopBar.defaultProps = {
  currentProjectKey: null,
  currentUser: null,
  isExperimental: false,
  openMenu: null,
};
