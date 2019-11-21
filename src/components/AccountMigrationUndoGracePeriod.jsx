import PropTypes from 'prop-types';
import React, {Fragment} from 'react';
import i18next from 'i18next';

export default function AccountMigrationUndoGracePeriod({onDismiss}) {
  return (
    <Fragment>
      <p>{i18next.t('account-migration.preparing')}</p>
      <div className="modal__buttons">
        <button className="modal__button" onClick={onDismiss}>
          {i18next.t('account-migration.buttons.stop')}
        </button>
      </div>
    </Fragment>
  );
}

AccountMigrationUndoGracePeriod.propTypes = {
  onDismiss: PropTypes.func.isRequired,
};
