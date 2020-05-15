export function deprecatedReducerTest(
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
