import classnames from 'classnames';
import i18next from 'i18next';
import PropTypes from 'prop-types';
import React from 'react';

import Modal from './Modal';

export default function LoginPrompt({isLoginPromptOpen, onLogin, onDismiss}) {
  if (!isLoginPromptOpen) {
    return null;
  }

  return (
    <Modal>
      <div className="login-prompt">
        <h1 className="modal__header">{i18next.t('login-prompt.header')}</h1>
        <div className="modal__buttons">
          <button
            className={classnames('modal__button', 'modal__button_confirm')}
            onClick={onLogin}
          >
            {i18next.t('login-prompt.login')}
          </button>
          <button
            className={classnames('modal__button', 'modal__button_cancel')}
            onClick={onDismiss}
          >
            {i18next.t('login-prompt.dismiss')}
          </button>
        </div>
      </div>
    </Modal>
  );
}

LoginPrompt.propTypes = {
  isLoginPromptOpen: PropTypes.bool.isRequired,
  onDismiss: PropTypes.func.isRequired,
  onLogin: PropTypes.func.isRequired,
};
