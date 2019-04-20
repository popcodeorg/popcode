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
    evaluateConsoleEntry(expression, key),
  );
  expect(state.history.size).toBe(1);
  expect(state.history.get(key).expression).toBe(expression);
});

test('consoleValueProduced adds value to existing entry', () => {
  const value = 2;
  const key = '123';
  const state = applyActions(
    evaluateConsoleEntry('1 + 1', key),
    consoleValueProduced(key, value),
  );

  expect(state.history.get(key).value).toBe(value);
});

test('consoleErrorProduced adds error to existing entry', () => {
  const key = '123';
  const name = 'NameError';
  const message = 'bogus is not defined';
  const state = applyActions(
    evaluateConsoleEntry('1 + bogus', key),
    consoleErrorProduced(key, name, message, 123456789),
  );

  expect(state.history.get(key).error).toMatchObject({name, message});
});

function applyActions(...actions) {
  return reduce(
    actions,
    (state, action) => reducer(state, action),
    undefined,
  );
}
