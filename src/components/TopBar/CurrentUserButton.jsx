import React from 'react';
import PropTypes from 'prop-types';

export default function CurrentUserButton({user: {avatarUrl, displayName}}) {
  return (
    <div className="top-bar__current-user">
      <img
        className="top-bar__avatar"
        src={avatarUrl}
      />
      <span className="top-bar__username">{displayName}</span>
      <span className="top-bar__drop-down-button u__icon">
        &#xf0d7;
      </span>
    </div>
  );
}

CurrentUserButton.propTypes = {
  user: PropTypes.shape({
    avatarUrl: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
  }).isRequired,
};
