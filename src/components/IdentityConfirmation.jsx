import React from 'react';
import PropTypes from 'prop-types';
import {t} from 'i18next';
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
          {t('identity-confirmation.title', {displayName})}
        </h1>

        <a
          href={config.gitHubLogoutUrl}
          target="_blank"
          onClick={onRejectIdentity}
        >
          {t('identity-confirmation.github-log-out-prompt', {displayName})}
        </a>

        <button
          className="identity-confirmation__confirm-button"
          type="button"
          onClick={onConfirmIdentity}
        >
          {t('identity-confirmation.confirm-identity', {displayName})}
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
