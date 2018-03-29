import noop from 'lodash/noop';
import {t} from 'i18next';
import tap from 'lodash/tap';
import PropTypes from 'prop-types';
import React from 'react';
import config from '../../config';
import createMenu, {MenuItem} from './createMenu';
import HamburgerMenuButton from './HamburgerMenuButton';

const HamburgerMenu = createMenu({
  menuClass: 'top-bar__menu_right',
  name: 'hamburger',

  renderItems({
    assignment,
    isExperimental,
    isGistExportInProgress,
    isRepoExportInProgress,
    isUserAuthenticated,
    user,
    onExportGist,
    onExportRepo,
    onOpenAssignmentSelector,
    onStartGoogleLogIn,
    onUpdateAssignment,
  }) {
    return tap([], (items) => {
      if (!isUserAuthenticated) {
        items.push(
          <MenuItem
            key="startGoogleLogIn"
            onClick={onStartGoogleLogIn}
          >
            Log in with Google
          </MenuItem>,
        );
      }

      if (isUserAuthenticated) {
        if (user.accessTokens['google.com']) {
          items.push(
            <MenuItem
              key="openAssignmentSelector"
              onClick={onOpenAssignmentSelector}
            >
              {t('top-bar.assign-to-classroom')}
            </MenuItem>,
          );
          if (assignment) {
            if (user.id === assignment.assignerId) {
              items.push(
                <MenuItem
                  key="updateAssignment"
                  onClick={onUpdateAssignment}
                >
                  Update Assignment
                </MenuItem>,
              );
            }
          }
        }

        if (user.accessTokens['github.com']) {
          items.push(
            <MenuItem
              key="exportGist"
              onClick={isGistExportInProgress ? noop : onExportGist}
            >
              {t('top-bar.export-gist')}
            </MenuItem>,
          );
        }

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
  assignment: PropTypes.object,
  isExperimental: PropTypes.bool.isRequired,
  isGistExportInProgress: PropTypes.bool.isRequired,
  isOpen: PropTypes.bool.isRequired,
  isRepoExportInProgress: PropTypes.bool.isRequired,
  isUserAuthenticated: PropTypes.bool.isRequired,
  user: PropTypes.object.isRequired,
  onExportGist: PropTypes.func.isRequired,
  onExportRepo: PropTypes.func.isRequired,
  onOpenAssignmentSelector: PropTypes.func.isRequired,
  onStartGoogleLogIn: PropTypes.func.isRequired,
  onUpdateAssignment: PropTypes.func.isRequired,
};

HamburgerMenu.defaultProps = {
  assignment: null,
};


export default HamburgerMenu;
