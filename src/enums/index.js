import Enum from 'enum';

export const LoginState = new Enum([
  'UNKNOWN',
  'ANONYMOUS',
  'AUTHENTICATED',
], 'LoginState');
