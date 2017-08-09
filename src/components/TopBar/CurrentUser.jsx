import classnames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import {t} from 'i18next';
import CurrentUserMenu from './CurrentUserMenu';

export default function CurrentUser({
  isOpen,
  user,
  onClick,
  onLogOut,
  onStartLogIn,
}) {
  if (user.authenticated) {
    const name = user.displayName;

    return (
      <div
        className={classnames(
          'top-bar__menu-button',
          'top-bar__current-user',
          {'top-bar__menu-button_active': isOpen},
        )}
        onClick={onClick}
      >
        <img
          className="top-bar__avatar"
          src={user.avatarUrl}
        />
        <span className="top-bar__username">{name}</span>
        <span className="top-bar__drop-down-button u__fontawesome">
          &#xf0d7;
        </span>
        <CurrentUserMenu isOpen={isOpen} onLogOut={onLogOut} />
      </div>
    );
  }
  return (
    <div className="top-bar__current-user">
      <span
        className="top-bar__log-in-prompt"
        onClick={onStartLogIn}
      >
        {t('top-bar.session.log-in-prompt')}
      </span>
    </div>
  );
}

CurrentUser.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  user: PropTypes.shape({
    authenticated: PropTypes.boolean,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
  onLogOut: PropTypes.func.isRequired,
  onStartLogIn: PropTypes.func.isRequired,
};
