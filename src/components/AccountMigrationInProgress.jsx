import i18next from 'i18next';
import React from 'react';

export default function AccountMigrationInProgress() {
  return <p>{i18next.t('account-migration.in-progress')}</p>;
}
