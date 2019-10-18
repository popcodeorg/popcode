import classnames from 'classnames';
import map from 'lodash-es/map';
import PropTypes from 'prop-types';
import React, {Fragment} from 'react';
import i18next from 'i18next';

export default function ProposedAccountMigration({onDismiss, onMigrate}) {
  return (
    <Fragment>
      {map(
        i18next.t('account-migration.proposal', {returnObjects: true}),
        paragraph => (
          <p key={paragraph}>{paragraph}</p>
        ),
      )}
      <div className="account-migration__buttons">
        <button
          className={classnames(
            'account-migration__button',
            'account-migration__button_confirm',
          )}
          onClick={onMigrate}
        >
          {i18next.t('account-migration.buttons.migrate')}
        </button>
        <button
          className={classnames(
            'account-migration__button',
            'account-migration__button_cancel',
          )}
          onClick={onDismiss}
        >
          {i18next.t('account-migration.buttons.cancel')}
        </button>
      </div>
    </Fragment>
  );
}

ProposedAccountMigration.propTypes = {
  onDismiss: PropTypes.func.isRequired,
  onMigrate: PropTypes.func.isRequired,
};
