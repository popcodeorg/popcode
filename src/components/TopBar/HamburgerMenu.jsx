import {t} from 'i18next';
import tap from 'lodash-es/tap';
import PropTypes from 'prop-types';
import React from 'react';
import config from '../../config';
import createMenu, {MenuItem} from './createMenu';
import HamburgerMenuButton from './HamburgerMenuButton';

const HamburgerMenu = createMenu({
  menuClass: 'top-bar__menu_right',
  name: 'hamburger',

  renderItems({
    hasExportedRepo,
    hasInstructions,
    isClassroomExportInProgress,
    isEditingInstructions,
    isExperimental,
    isGapiReady,
    isGistExportInProgress,
    isRepoExportInProgress,
    isUserAuthenticatedWithGithub,
    isUserAuthenticatedWithGoogle,
    onExportGist,
    onExportRepo,
    onUpdateRepo,
    onExportToClassroom,
    onStartEditingInstructions,
    onStartGoogleLogIn,

  }) {
    return tap([], (items) => {
      if (
        !isUserAuthenticatedWithGithub &&
        !isUserAuthenticatedWithGoogle &&
        isExperimental &&
        isGapiReady
      ) {
        items.push(
          <MenuItem
            key="startGoogleLogIn"
            onClick={onStartGoogleLogIn}
          >
            Login with Google
          </MenuItem>,
        );
      }
      items.push(
        <MenuItem
          isDisabled={isClassroomExportInProgress}
          key="exportToClassroom"
          onClick={onExportToClassroom}
        >
          {t('top-bar.share-to-classroom')}
        </MenuItem>,
      );

      items.push(
        <MenuItem
          isDisabled={isEditingInstructions}
          key="addOrEditInstructions"
          onClick={onStartEditingInstructions}
        >
          {
            hasInstructions ?
              t('top-bar.edit-instructions') :
              t('top-bar.add-instructions')
          }
        </MenuItem>,
      );

      if (isUserAuthenticatedWithGithub) {
        items.push(
          <MenuItem
            idDisabled={isGistExportInProgress}
            key="exportGist"
            onClick={onExportGist}
          >
            {t('top-bar.export-gist')}
          </MenuItem>,
        );

        if (hasExportedRepo) {
          items.push(
            <MenuItem
              isDisabled={isRepoExportInProgress}
              key="updateRepo"
              onClick={onUpdateRepo}
            >
              {t('top-bar.update-repo')}
            </MenuItem>,
          );
        } else {
          items.push(
            <MenuItem
              isDisabled={isRepoExportInProgress}
              key="exportRepo"
              onClick={onExportRepo}
            >
              {t('top-bar.export-repo')}
            </MenuItem>,
          );
        }
      }

      items.push(
        <a
          className="top-bar__menu-item"
          href={config.feedbackUrl}
          key="feedback"
          rel="noopener noreferrer"
          target="blank"
        >
          {t('top-bar.send-feedback')}
        </a>,
      );

      items.push(
        <div
          className="top-bar__menu-item top-bar__menu-item_icons"
          key="social"
        >
          <a
            className="u__icon top-bar__menu-item-icon"
            href="https://github.com/popcodeorg/popcode"
            rel="noopener noreferrer"
            target="_blank"
          >&#xf09b;</a>
          <a
            className="u__icon top-bar__menu-item-icon"
            href="https://twitter.com/popcodeorg"
            rel="noopener noreferrer"
            target="_blank"
          >&#xf099;</a>
          <a
            className="u__icon top-bar__menu-item-icon"
            href="https://slack.popcode.org/"
            rel="noopener noreferrer"
            target="_blank"
          >&#xf198;</a>
        </div>,
      );
    });
  },
})(HamburgerMenuButton);


HamburgerMenu.propTypes = {
  hasExportedRepo: PropTypes.bool.isRequired,
  hasInstructions: PropTypes.bool.isRequired,
  isClassroomExportInProgress: PropTypes.bool.isRequired,
  isEditingInstructions: PropTypes.bool.isRequired,
  isExperimental: PropTypes.bool.isRequired,
  isGapiReady: PropTypes.bool.isRequired,
  isGistExportInProgress: PropTypes.bool.isRequired,
  isOpen: PropTypes.bool.isRequired,
  isRepoExportInProgress: PropTypes.bool.isRequired,
  isUserAuthenticatedWithGithub: PropTypes.bool.isRequired,
  isUserAuthenticatedWithGoogle: PropTypes.bool.isRequired,
  onExportGist: PropTypes.func.isRequired,
  onExportRepo: PropTypes.func.isRequired,
  onExportToClassroom: PropTypes.func.isRequired,
  onStartEditingInstructions: PropTypes.func.isRequired,
  onUpdateRepo: PropTypes.func.isRequired,
};

HamburgerMenu.defaultProps = {
  onStartGoogleLogIn: PropTypes.func.isRequired,
  onUpdateRepo: PropTypes.func.isRequired,
};

export default HamburgerMenu;
