import classnames from 'classnames';
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

  const buttonClassName = 'identity-confirmation__button';

  return (
    <div className="identity-confirmation">
      <div className="identity-confirmation__modal">
        <h1 className="identity-confirmation__title">
          {t('identity-confirmation.title', {displayName})}
        </h1>

        <button
          className={classnames(
            buttonClassName,
            `${buttonClassName}_confirm`,
          )}
          type="button"
          onClick={onConfirmIdentity}
        >
          {t('identity-confirmation.confirm-identity', {displayName})}
        </button>

        <a
          className={classnames(
            buttonClassName,
            `${buttonClassName}_reject`,
          )}
          href={config.gitHubLogoutUrl}
          target="_blank"
          onClick={onRejectIdentity}
        >
          {t('identity-confirmation.github-log-out-prompt', {displayName})}
        </a>
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
