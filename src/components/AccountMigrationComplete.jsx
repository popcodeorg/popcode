import classnames from 'classnames';
import i18next from 'i18next';
import React, {Fragment} from 'react';
import PropTypes from 'prop-types';

export default function AccountMigrationComplete({onDismiss}) {
  return (
    <Fragment>
<<<<<<< HEAD
      <p>{i18next.t('account-migration.complete')}</p>
      <div className="account-migration__buttons">
        <button
          className={classnames('account-migration__button')}
          onClick={onDismiss}
        >
          {i18next.t('account-migration.buttons.dismiss')}
=======
      <p>{t('account-migration.complete')}</p>
      <div className="modal__buttons">
        <button className={classnames('modal__button')} onClick={onDismiss}>
          {t('account-migration.buttons.dismiss')}
>>>>>>> c27b9a50... add hot keys
        </button>
      </div>
    </Fragment>
  );
}

AccountMigrationComplete.propTypes = {
  onDismiss: PropTypes.func.isRequired,
};
