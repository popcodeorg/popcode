import reduce from 'lodash-es/reduce';

import reducer from '../console';

import {
  consoleErrorProduced,
  consoleLogBatchProduced,
  consoleValueProduced,
  evaluateConsoleEntry,
  nextConsoleHistory,
  previousConsoleHistory,
} from '../../actions';

test('evaluateConsoleEntry adds entry to history', () => {
  const expression = '1 + 1';
  const key = '123';
  const state = applyActions(
    undefined,
    evaluateConsoleEntry(expression, key),
  );
  expect(state.history.size).toBe(1);
  expect(state.history.get('123').expression).toBe(expression);
});

test('consoleValueProduced adds value to existing entry', () => {
  const value = 2;
  const key = '123';
  const state = applyActions(
    undefined,
    evaluateConsoleEntry('1 + 1', key),
    consoleValueProduced(key, value),
  );

  expect(state.history.get('123').value).toBe(value);
});

function applyActions(initialState, ...actions) {
  return reduce(
    actions,
    (state, action) => reducer(state, action),
    initialState,
  );
}
