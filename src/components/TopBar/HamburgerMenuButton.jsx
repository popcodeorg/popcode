import classnames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import HamburgerMenu from './HamburgerMenu';

export default function HamburgerMenuButton({
  isExperimental,
  isGistExportInProgress,
  isOpen,
  isUserAuthenticated,
  onClick,
  onExportGist,
  onExportRepo,
}) {
  return (
    <div
      className={classnames(
        'top-bar__menu-button',
        'top-bar__menu-button_hamburger',
        {'top-bar__menu-button_active': isOpen},
      )}
      onClick={onClick}
    >
      <span className="u__icon top-bar__hamburger">&#xf0c9;</span>
      <HamburgerMenu
        isExperimental={isExperimental}
        isGistExportInProgress={isGistExportInProgress}
        isOpen={isOpen}
        isUserAuthenticated={isUserAuthenticated}
        onExportGist={onExportGist}
        onExportRepo={onExportRepo}
      />
    </div>
  );
}

HamburgerMenuButton.propTypes = {
  isExperimental: PropTypes.bool.isRequired,
  isGistExportInProgress: PropTypes.bool.isRequired,
  isOpen: PropTypes.bool.isRequired,
  isUserAuthenticated: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  onExportGist: PropTypes.func.isRequired,
  onExportRepo: PropTypes.func.isRequired,
};
