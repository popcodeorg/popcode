import classnames from 'classnames';
import {t} from 'i18next';
import React, {Fragment} from 'react';
import PropTypes from 'prop-types';

export default function AccountMigrationComplete({onDismiss}) {
  return (
    <Fragment>
      <p>{t('account-migration.complete')}</p>
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

AccountMigrationComplete.propTypes = {
  onDismiss: PropTypes.func.isRequired,
};
