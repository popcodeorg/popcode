import Enum from 'enum';

export const LoginState = new Enum(
  ['UNKNOWN', 'ANONYMOUS', 'AUTHENTICATED'],
  'LoginState',
);

export const AccountMigrationState = new Enum([
  'PROPOSED',
  'UNDO_GRACE_PERIOD',
  'IN_PROGRESS',
  'COMPLETE',
  'ERROR',
]);

export const AssignmentState = new Enum(['PUBLISHED', 'DRAFT', 'ASSIGNMENT']);
