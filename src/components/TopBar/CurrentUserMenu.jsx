import ClickOutside from 'react-click-outside';
import PropTypes from 'prop-types';
import React from 'react';
import {t} from 'i18next';

export default function CurrentUserMenu({isOpen, onClose, onLogOut}) {
  if (!isOpen) {
    return null;
  }

  return (
    <ClickOutside onClickOutside={onClose}>
      <div className="top-bar__menu">
        <div className="top-bar__menu-item" onClick={onLogOut}>
          {t('top-bar.session.log-out-prompt')}
        </div>
      </div>
    </ClickOutside>
  );
}

CurrentUserMenu.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onLogOut: PropTypes.func.isRequired,
};
