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
  const state = reducer(undefined, evaluateConsoleEntry(expression, key));
  expect(state.history.size).toBe(1);
  expect(state.history.get('123').expression).toBe(expression);
});
