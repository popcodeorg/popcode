import classnames from 'classnames';
import isNull from 'lodash-es/isNull';
import map from 'lodash-es/map';
import PropTypes from 'prop-types';
import React from 'react';
import {t} from 'i18next';

import {
  AccountMigration as AccountMigrationRecord,
  UserAccount as UserAccountRecord,
} from '../records';

import Modal from './Modal';

export default function AccountMigration({currentUserAccount, migration}) {
  if (isNull(currentUserAccount) || isNull(migration)) {
    return null;
  }

  return (
    <Modal>
      <div className="account-migration">
        <h1 className="account-migration__header">
          {t('account-migration.header')}
        </h1>
        <div className="account-migration__accounts">
          <div className="account-migration__account">
            <p className="account-migration__account-label">
              {t('account-migration.your-account')}
            </p>
            <img
              className="account-migration__avatar"
              src={currentUserAccount.avatarUrl}
            />
            <div className="account-migration__user-name">
              {currentUserAccount.displayName}
            </div>
          </div>
          <div
            className="account-migration__merge-icon u__icon u__icon_disabled"
          >
            &#xf0ec;
          </div>
          <div className="account-migration__account">
            <p className="account-migration__account-label">
              {t('account-migration.account-to-merge')}
            </p>
            <img
              className="account-migration__avatar"
              src={migration.userAccountToMerge.avatarUrl}
            />
            <div className="account-migration__user-name">
              {migration.userAccountToMerge.displayName}
            </div>
          </div>
        </div>
        {
          map(
            t('account-migration.message', {returnObjects: true}),
            paragraph => (
              <p key={paragraph}>{paragraph}</p>
            ),
          )
        }
        <div className="account-migration__buttons">
          <button
            className={classnames(
              'account-migration__button',
              'account-migration__button_confirm',
            )}
          >
            {t('account-migration.buttons.migrate')}
          </button>
          <button
            className={classnames(
              'account-migration__button',
              'account-migration__button_cancel',
            )}
          >
            {t('account-migration.buttons.cancel')}
          </button>
        </div>
      </div>
    </Modal>
  );
}

AccountMigration.propTypes = {
  currentUserAccount: PropTypes.instanceOf(UserAccountRecord),
  migration: PropTypes.instanceOf(AccountMigrationRecord),
};

AccountMigration.defaultProps = {
  currentUserAccount: null,
  migration: null,
};
