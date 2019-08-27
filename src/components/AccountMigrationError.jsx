import PropTypes from 'prop-types';
import React, {Fragment} from 'react';
import i18next from 'i18next';

export default function AccountMigrationError({onDismiss}) {
  return (
    <Fragment>
<<<<<<< HEAD
      <p>{i18next.t('account-migration.error')}</p>
      <div className="account-migration__buttons">
        <button
          className={classnames('account-migration__button')}
          onClick={onDismiss}
        >
          {i18next.t('account-migration.buttons.dismiss')}
=======
      <p>{t('account-migration.error')}</p>
      <div className="modal__buttons">
        <button className="modal__button" onClick={onDismiss}>
          {t('account-migration.buttons.dismiss')}
>>>>>>> c27b9a50... add hot keys
        </button>
      </div>
    </Fragment>
  );
}

AccountMigrationError.propTypes = {
  onDismiss: PropTypes.func.isRequired,
};
