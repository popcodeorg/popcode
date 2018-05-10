import noop from 'lodash-es/noop';
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
    hasInstructions,
    isEditingInstructions,
    isExperimental,
    isGistExportInProgress,
    isRepoExportInProgress,
    isClassroomExportInProgress,
    isUserAuthenticated,
    onExportGist,
    onExportRepo,
    onExportToClassroom,
    onStartEditingInstructions,
  }) {
    return tap([], (items) => {
      items.push(
        <MenuItem
          key="exportToClassroom"
          onClick={isClassroomExportInProgress ? noop : onExportToClassroom}
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

      if (isUserAuthenticated) {
        items.push(
          <MenuItem
            key="exportGist"
            onClick={isGistExportInProgress ? noop : onExportGist}
          >
            {t('top-bar.export-gist')}
          </MenuItem>,
        );

        if (isExperimental) {
          items.push(
            <MenuItem
              key="exportRepo"
              onClick={isRepoExportInProgress ? noop : onExportRepo}
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
  hasInstructions: PropTypes.bool.isRequired,
  isClassroomExportInProgress: PropTypes.bool.isRequired,
  isEditingInstructions: PropTypes.bool.isRequired,
  isExperimental: PropTypes.bool.isRequired,
  isGistExportInProgress: PropTypes.bool.isRequired,
  isOpen: PropTypes.bool.isRequired,
  isRepoExportInProgress: PropTypes.bool.isRequired,
  isUserAuthenticated: PropTypes.bool.isRequired,
  onExportGist: PropTypes.func.isRequired,
  onExportRepo: PropTypes.func.isRequired,
  onExportToClassroom: PropTypes.func.isRequired,
  onStartEditingInstructions: PropTypes.func.isRequired,
};

export default HamburgerMenu;
