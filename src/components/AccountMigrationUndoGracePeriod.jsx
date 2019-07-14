import classnames from 'classnames';
import PropTypes from 'prop-types';
import React, {Fragment} from 'react';
import {t} from 'i18next';

export default function AccountMigrationUndoGracePeriod({onDismiss}) {
  return (
    <Fragment>
      <p>{t('account-migration.preparing')}</p>
      <div className="account-migration__buttons">
        <button
          className={classnames('account-migration__button')}
          onClick={onDismiss}
        >
          {t('account-migration.buttons.stop')}
        </button>
      </div>
    </Fragment>
  );
}

AccountMigrationUndoGracePeriod.propTypes = {
  onDismiss: PropTypes.func.isRequired,
};
