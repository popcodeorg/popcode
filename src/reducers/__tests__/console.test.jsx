import forEach from 'lodash-es/forEach';
import map from 'lodash-es/map';
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
  expect(state.history.get(key)).toMatchObject({expression});
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

test('consoleLogBatchProduced adds entries to history', () => {
  const entries = [
    {
      value: 'Second console message',
      compiledProjectKey: 987654321,
      key: '123',
    },
    {
      value: 'A console message',
      compiledProjectKey: 123456789,
      key: '456',
    },
  ];
  const {history} = applyActions(consoleLogBatchProduced(entries));

  const keysInCorrectOrder = map(entries, 'key');
  expect(Array.from(history.keySeq())).toEqual(keysInCorrectOrder);
  forEach(entries, ({key, value, compiledProjectKey}) => {
    expect(history.get(key)).toMatchObject({
      value,
      evaluatedByCompiledProjectKey: compiledProjectKey,
    });
  });
});

function applyActions(...actions) {
  return reduce(
    actions,
    (state, action) => reducer(state, action),
    undefined,
  );
}
