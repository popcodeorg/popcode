import React from 'react';
import i18next from 'i18next';

export default function AccountMigrationInProgress() {
  return <p>{i18next.t('account-migration.in-progress')}</p>;
}
