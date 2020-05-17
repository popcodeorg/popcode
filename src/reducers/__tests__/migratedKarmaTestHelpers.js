/**
 * @deprecated This helper supports a testing style used in the original reducer
 * tests in the Tape/Karma test suite. This style of testing reducers is
 * discouraged, and this helper should not be used in new tests. Reducer tests
 * should only assert on the specific outcomes the test cares about, rather than
 * asserting an exact match of a full state shape. See ui.test.js for an example
 * of the preferred reducer testing style.
 */
export function deprecated_reducerTest( // eslint-disable-line camelcase
  reducer,
  stateBefore,
  action,
  stateAfter,
) {
  return () => {
    const expected = stateAfter;
    const actual = reducer(stateBefore, action());
    expect(expected).toEqualImmutable(actual);
  };
}
