import {List, Map, Record} from 'immutable';

export default class Error extends Record(
  {
    row: null,
    column: null,
    reason: null,
    payload: new Map(),
    suppresses: new List(),
    text: null,
    raw: null,
    type: 'error',
  },
  'Error',
) {
  static fromJS(js) {
    return new this(
      Object.assign({}, js, {
        payload: new Map(js.payload || {}),
        suppresses: new List(js.suppresses || []),
      }),
    );
  }
}
