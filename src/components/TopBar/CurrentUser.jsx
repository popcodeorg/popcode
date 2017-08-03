import React from 'react';
import PropTypes from 'prop-types';
import {t} from 'i18next';

export default function CurrentUser({user, onLogOut, onStartLogIn}) {
  if (user.authenticated) {
    const name = user.displayName;

    return (
      <div className="top-bar__current-user">
        <img
          className="top-bar__avatar"
          src={user.avatarUrl}
        />
        <span className="top-bar__username">{name}</span>
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
  user: PropTypes.shape({
    authenticated: PropTypes.boolean,
  }).isRequired,
  onLogOut: PropTypes.func.isRequired,
  onStartLogIn: PropTypes.func.isRequired,
};
