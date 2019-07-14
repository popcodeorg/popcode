import Immutable from 'immutable';

export default (
  reducer,
  stateBefore,
  action,
  stateAfter,
  description,
) => assert => {
  const expected = stateAfter;
  const actual = reducer(stateBefore, action());
  let message = `Expected:\n${expected}\n\nActual:\n${actual}`;
  if (description) {
    message = `${description}\n\n${message}`;
  }
  assert.ok(Immutable.is(expected, actual), message);

  assert.end();
};
