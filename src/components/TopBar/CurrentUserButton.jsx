import {library} from '@fortawesome/fontawesome-svg-core';
import {faCaretDown} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import React from 'react';

library.add(faCaretDown);

export default function CurrentUserButton({user: {avatarUrl, displayName}}) {
  return (
    <div className="top-bar__current-user">
      <img
        className="top-bar__avatar"
        src={avatarUrl}
      />
      <span className="top-bar__username">{displayName}</span>
      <FontAwesomeIcon
        className="top-bar__drop-down-button"
        icon="caret-down"
      />
    </div>
  );
}

CurrentUserButton.propTypes = {
  user: PropTypes.shape({
    avatarUrl: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
  }).isRequired,
};
