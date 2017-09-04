import React from 'react';
import PropTypes from 'prop-types';
import {t} from 'i18next';
import AuthenticationStates from '../../enums/AuthenticationStates';
import CurrentUserMenu from './CurrentUserMenu';

export default function CurrentUser({
  user,
  onLogOut,
  onStartLogIn,
}) {
  if (user.authenticationState === AuthenticationStates.CONFIRMED) {
    return <CurrentUserMenu user={user} onLogOut={onLogOut} />;
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
  user: PropTypes.shape({
    authenticationState: PropTypes.oneOf(AuthenticationStates),
  }).isRequired,
  onLogOut: PropTypes.func.isRequired,
  onStartLogIn: PropTypes.func.isRequired,
};
