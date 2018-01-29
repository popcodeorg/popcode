import classnames from 'classnames';
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
  if (user.authenticationState === AuthenticationStates.AUTHENTICATED) {
    return <CurrentUserMenu user={user} onLogOut={onLogOut} />;
  }
  return (
    <div
      className={classnames('top-bar__current-user',
        'top-bar__menu-button',
        'top-bar__menu-button_primary',
      )}
      onClick={onStartLogIn}
    >
      {t('top-bar.session.log-in-prompt')}
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
