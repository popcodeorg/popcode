import classnames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import {t} from 'i18next';

import CurrentUserMenu from './CurrentUserMenu';

export default function CurrentUser({
  user,
  onLogOut,
  onStartGithubLogIn,
}) {
  if (user.authenticated) {
    return <CurrentUserMenu user={user} onLogOut={onLogOut} />;
  }
  return (
    <div
      className={classnames('top-bar__current-user',
        'top-bar__menu-button',
        'top-bar__menu-button_primary',
      )}
      onClick={onStartGithubLogIn}
    >
      {t('top-bar.session.log-in-prompt')}
    </div>
  );
}

CurrentUser.propTypes = {
  user: PropTypes.shape({
    authenticated: PropTypes.boolean,
  }).isRequired,
  onLogOut: PropTypes.func.isRequired,
  onStartGithubLogIn: PropTypes.func.isRequired,
};
