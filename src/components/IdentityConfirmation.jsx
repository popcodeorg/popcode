import React from 'react';
import PropTypes from 'prop-types';
import AuthenticationStates from '../enums/AuthenticationStates';
import config from '../config';

function IdentityConfirmation({
  currentUser,
  onConfirmIdentity,
  onRejectIdentity,
}) {
  const {authenticationState, displayName} = currentUser;

  if (authenticationState !== AuthenticationStates.PENDING_CONFIRMATION) {
    return null;
  }

  return (
    <div className="identity-confirmation">
      <div className="identity-confirmation__modal">
        <h1 className="identity-confirmation__title">
          {`Are you ${displayName}?`}
        </h1>

        <p>
          {`If you are not ${displayName}:`}
        </p>

        <ol>
          <li>
            Click the link below to be taken to the GitHub logout page.
          </li>

          <li>
            On the GitHub logout page, click the log out button.
          </li>

          <li>
            Sign in with your own username and password.
          </li>

          <li>
            {'Come back here and click "Log in" again.'}
          </li>
        </ol>

        <a
          href={config.gitHubLogoutUrl}
          target="_blank"
          onClick={onRejectIdentity}
        >
          {`If you are not ${displayName}, click here to  be taken
          to the GitHub logout page.`}
        </a>

        <button
          className="identity-confirmation__confirm-btn"
          type="button"
          onClick={onConfirmIdentity}
        >
          {`Yes, I am ${displayName}. Log me into Popcode!`}
        </button>
      </div>
    </div>
  );
}

IdentityConfirmation.propTypes = {
  currentUser: PropTypes.object.isRequired,
  onConfirmIdentity: PropTypes.func.isRequired,
  onRejectIdentity: PropTypes.func.isRequired,
};

export default IdentityConfirmation;
