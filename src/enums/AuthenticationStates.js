import {Enum} from 'enumify';

export default class AuthenticationStates extends Enum {}
AuthenticationStates.initEnum([
  'AUTHENTICATED',
  'CONFIRMED',
  'REJECTED',
  'UNKNOWN',
]);
