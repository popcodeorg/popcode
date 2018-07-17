import Enum from 'enum';

export const LoginState = new Enum([
  'UNKNOWN',
  'ANONYMOUS',
  'AUTHENTICATED',
], 'LoginState');

export const AccountMigrationState = new Enum([
  'PROPOSED',
  'IN_PROGRESS',
  'COMPLETE',
]);
