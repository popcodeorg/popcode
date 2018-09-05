import {Record, Map, List} from 'immutable';

export default class TestResultAssertion extends Record({
  actual: null,
  error: new Map(),
  expected: null,
  name: null,
  ok: false,
  operator: null,
  test: null,
  type: null,
}, 'TestResultAssertion') {
  static fromJS(js) {
    return new this(
      Object.assign({}, js, {
        payload: new Map(js.payload || {}),
        suppresses: new List(js.suppresses || []),
      }),
    );
  }
}
