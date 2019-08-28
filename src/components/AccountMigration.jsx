import {faExchangeAlt} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import i18next from 'i18next';
import isNull from 'lodash-es/isNull';
import PropTypes from 'prop-types';
import React from 'react';

import {AccountMigrationState} from '../enums';
import {
  AccountMigration as AccountMigrationRecord,
  UserAccount as UserAccountRecord,
} from '../records';

import AccountMigrationComplete from './AccountMigrationComplete';
import AccountMigrationError from './AccountMigrationError';
import AccountMigrationInProgress from './AccountMigrationInProgress';
import AccountMigrationUndoGracePeriod from './AccountMigrationUndoGracePeriod';
import Modal from './Modal';
import ProposedAccountMigration from './ProposedAccountMigration';

export default function AccountMigration({
  currentUserAccount,
  migration,
  onDismiss,
  onMigrate,
}) {
  if (isNull(currentUserAccount) || isNull(migration)) {
    return null;
  }

  return (
    <Modal onClose={onDismiss}>
      <div className="account-migration">
        <h1 className="modal__header">
          {i18next.t(
            `account-migration.header.${migration.state.key
              .toLowerCase()
              .replace(/_/gu, '-')}`,
          )}
        </h1>
        <div className="account-migration__accounts">
          <div className="account-migration__account">
            <p className="account-migration__account-label">
              {i18next.t('account-migration.your-account')}
            </p>
            <img
              className="account-migration__avatar"
              src={currentUserAccount.avatarUrl}
            />
            <div className="account-migration__user-name">
              {currentUserAccount.displayName}
            </div>
          </div>
          <div className="account-migration__merge-icon">
            <FontAwesomeIcon icon={faExchangeAlt} />
          </div>
          <div className="account-migration__account">
            <p className="account-migration__account-label">
              {i18next.t('account-migration.account-to-merge')}
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
        {(() => {
          switch (migration.state) {
            case AccountMigrationState.PROPOSED:
              return (
                <ProposedAccountMigration
                  onDismiss={onDismiss}
                  onMigrate={onMigrate}
                />
              );
            case AccountMigrationState.UNDO_GRACE_PERIOD:
              return <AccountMigrationUndoGracePeriod onDismiss={onDismiss} />;
            case AccountMigrationState.IN_PROGRESS:
              return <AccountMigrationInProgress />;
            case AccountMigrationState.COMPLETE:
              return <AccountMigrationComplete onDismiss={onDismiss} />;
            case AccountMigrationState.ERROR:
              return <AccountMigrationError onDismiss={onDismiss} />;
          }
          return null;
        })()}
      </div>
    </Modal>
  );
}

AccountMigration.propTypes = {
  currentUserAccount: PropTypes.instanceOf(UserAccountRecord),
  migration: PropTypes.instanceOf(AccountMigrationRecord),
  onDismiss: PropTypes.func.isRequired,
  onMigrate: PropTypes.func.isRequired,
};

AccountMigration.defaultProps = {
  currentUserAccount: null,
  migration: null,
};
