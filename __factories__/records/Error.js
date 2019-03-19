import {List} from 'immutable';
import {Factory} from 'rosie';

import Error from '../../src/records/Error';

export const errorFactory = new Factory(Error).attrs({
  row: 3,
  column: 2,
  reason: 'bad-code',
  payload: {},
  suppresses: new List(),
  text: 'Bad code',
  raw: 'Bad code',
});
