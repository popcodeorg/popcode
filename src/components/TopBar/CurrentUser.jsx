import React from 'react';
import PropTypes from 'prop-types';
import {t} from 'i18next';
import CurrentUserMenu from './CurrentUserMenu';

export default function CurrentUser({
  user,
  onLogOut,
  onStartLogIn,
}) {
  if (user.authenticated) {
    return <CurrentUserMenu user={user} onLogOut={onLogOut} />;
  }
  return (
    <div className="top-bar__current-user top-bar__menu-button">
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
  user: PropTypes.shape({
    authenticated: PropTypes.boolean,
  }).isRequired,
  onLogOut: PropTypes.func.isRequired,
  onStartLogIn: PropTypes.func.isRequired,
};
