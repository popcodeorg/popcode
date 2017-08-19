import isNull from 'lodash/isNull';
import React from 'react';
import PropTypes from 'prop-types';

function navigateToGithubLogOut() {
  const GITHUB_LOGOUT_URL = 'https://github.com/logout';
  window.open(GITHUB_LOGOUT_URL, '_blank');
}

function IdentityConfirmation({currentUser, onConfirmIdentity}) {
  const {unconfirmedIdentity} = currentUser;

  function handleConfirmIdentity() {
    onConfirmIdentity(currentUser.unconfirmedIdentity);
  }

  if (isNull(unconfirmedIdentity)) {
    return null;
  }

  return (
    <div className="identity-confirmation">
      <div className="identity-confirmation__modal">
        {`Are you ${unconfirmedIdentity.displayName}?`}

        <button type="button" onClick={navigateToGithubLogOut}>
          No
        </button>

        <button type="button" onClick={handleConfirmIdentity}>
          Yes
        </button>
      </div>
    </div>
  );
}

IdentityConfirmation.propTypes = {
  currentUser: PropTypes.object.isRequired,
  onConfirmIdentity: PropTypes.func.isRequired,
};

export default IdentityConfirmation;
