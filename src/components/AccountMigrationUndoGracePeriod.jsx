import classnames from 'classnames';
import PropTypes from 'prop-types';
import React, {Fragment} from 'react';
import i18next from 'i18next';

export default function AccountMigrationUndoGracePeriod({onDismiss}) {
  return (
    <Fragment>
<<<<<<< HEAD
      <p>{i18next.t('account-migration.preparing')}</p>
      <div className="account-migration__buttons">
        <button
          className={classnames('account-migration__button')}
          onClick={onDismiss}
        >
          {i18next.t('account-migration.buttons.stop')}
=======
      <p>{t('account-migration.preparing')}</p>
      <div className="modal__buttons">
        <button className={classnames('modal__button')} onClick={onDismiss}>
          {t('account-migration.buttons.stop')}
>>>>>>> c27b9a50... add hot keys
        </button>
      </div>
    </Fragment>
  );
}

AccountMigrationUndoGracePeriod.propTypes = {
  onDismiss: PropTypes.func.isRequired,
};
