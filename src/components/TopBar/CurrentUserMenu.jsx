import React from 'react';
import PropTypes from 'prop-types';
import {t} from 'i18next';

export default function CurrentUserMenu({isOpen, onLogOut}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="top-bar__menu">
      <div className="top-bar__menu-item" onClick={onLogOut}>
        {t('top-bar.session.log-out-prompt')}
      </div>
    </div>
  );
}

CurrentUserMenu.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onLogOut: PropTypes.func.isRequired,
};
