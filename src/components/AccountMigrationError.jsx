import classnames from 'classnames';
import PropTypes from 'prop-types';
import React, {Fragment} from 'react';
import {t} from 'i18next';

export default function AccountMigrationError({onDismiss}) {
  return (
    <Fragment>
      <p>{t('account-migration.error')}</p>
      <div className="account-migration__buttons">
        <button
          className={classnames('account-migration__button')}
          onClick={onDismiss}
        >
          {t('account-migration.buttons.dismiss')}
        </button>
      </div>
    </Fragment>
  );
}

AccountMigrationError.propTypes = {
  onDismiss: PropTypes.func.isRequired,
};
