import classnames from 'classnames';
import {noop} from 'lodash/noop';
import {t} from 'i18next';
import PropTypes from 'prop-types';
import React from 'react';
import config from '../../config';

export default function HamburgerMenu({
  isExperimental,
  isGistExportInProgress,
  isOpen,
  isUserAuthenticated,
  onExportGist,
  onExportRepo,
}) {
  if (!isOpen) {
    return null;
  }


  return (
    <div className="top-bar__menu">
      <div
        className="top-bar__menu-item"
        onClick={isGistExportInProgress ? noop : onExportGist}
      >
        {t('top-bar.export-gist')}
      </div>
      <div
        className={
          classnames(
            'top-bar__menu-item',
            {u__hidden: !(isUserAuthenticated && isExperimental)},
          )
        }
        onClick={onExportRepo}
      >
        {t('top-bar.export-repo')}
      </div>
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
          className="u__icon"
          href="https://github.com/popcodeorg/popcode"
          rel="noopener noreferrer"
          target="_blank"
        >&#xf09b;</a>
        <a
          className="u__icon"
          href="https://twitter.com/popcodeorg"
          rel="noopener noreferrer"
          target="_blank"
        >&#xf099;</a>
        <a
          className="u__icon"
          href="https://slack.popcode.org/"
          rel="noopener noreferrer"
          target="_blank"
        >&#xf198;</a>
      </div>
    </div>
  );
}

HamburgerMenu.propTypes = {
  isExperimental: PropTypes.bool.isRequired,
  isGistExportInProgress: PropTypes.bool.isRequired,
  isOpen: PropTypes.bool.isRequired,
  isUserAuthenticated: PropTypes.bool.isRequired,
  onExportGist: PropTypes.func.isRequired,
  onExportRepo: PropTypes.func.isRequired,
};
