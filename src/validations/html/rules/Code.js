import {Enum} from 'enumify';

export default class Code extends Enum {}
Code.initEnum([
  'MISPLACED_CLOSE_TAG',
  'UNCLOSED_TAG',
  'UNOPENED_TAG',
]);
