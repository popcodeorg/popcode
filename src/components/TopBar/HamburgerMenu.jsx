/* eslint-disable react/prop-types */

import {
  faGithub,
  faSlackHash,
  faTwitter,
} from '@fortawesome/free-brands-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {t} from 'i18next';
import PropTypes from 'prop-types';
import React, {Fragment} from 'react';

import config from '../../config';

import createMenu, {MenuItem} from './createMenu';
import HamburgerMenuButton from './HamburgerMenuButton';

const HamburgerMenu = createMenu({
  menuClass: 'top-bar__menu_right',
  name: 'hamburger',

  renderItems({
    hasInstructions,
    isEditingInstructions,
    isUserAuthenticated,
    onStartEditingInstructions,
    onStartGithubLogIn,
  }) {
    return (
      <Fragment>
        <MenuItem
          isDisabled={isEditingInstructions}
          onClick={onStartEditingInstructions}
        >
          {hasInstructions
            ? t('top-bar.edit-instructions')
            : t('top-bar.add-instructions')}
        </MenuItem>

        {!isUserAuthenticated && (
          <MenuItem onClick={onStartGithubLogIn}>
            {t('top-bar.session.log-in-github')}
          </MenuItem>
        )}

        <a
          className="top-bar__menu-item"
          href={config.feedbackUrl}
          rel="noopener noreferrer"
          target="blank"
        >
          {t('top-bar.send-feedback')}
        </a>

        <div className="top-bar__menu-item top-bar__menu-item_icons">
          <a
            className="top-bar__menu-item-icon"
            href="https://github.com/popcodeorg/popcode"
            rel="noopener noreferrer"
            target="_blank"
          >
            <FontAwesomeIcon icon={faGithub} />
          </a>
          <a
            className="top-bar__menu-item-icon"
            href="https://twitter.com/popcodeorg"
            rel="noopener noreferrer"
            target="_blank"
          >
            <FontAwesomeIcon icon={faTwitter} />
          </a>
          <a
            className="top-bar__menu-item-icon"
            href="https://slack.popcode.org/"
            rel="noopener noreferrer"
            target="_blank"
          >
            <FontAwesomeIcon icon={faSlackHash} />
          </a>
        </div>
      </Fragment>
    );
  },
})(HamburgerMenuButton);

HamburgerMenu.propTypes = {
  hasInstructions: PropTypes.bool.isRequired,
  isEditingInstructions: PropTypes.bool.isRequired,
  isUserAuthenticated: PropTypes.bool.isRequired,
  onStartEditingInstructions: PropTypes.func.isRequired,
  onStartGithubLogIn: PropTypes.func.isRequired,
};

export default HamburgerMenu;
