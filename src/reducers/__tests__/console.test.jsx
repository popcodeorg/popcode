import forEach from 'lodash-es/forEach';
import map from 'lodash-es/map';
import reduce from 'lodash-es/reduce';

import reducer from '../console';
import {Error} from '../../records';

import {
  consoleErrorProduced,
  consoleLogBatchProduced,
  consoleValueProduced,
  evaluateConsoleEntry,
  nextConsoleHistory,
  previousConsoleHistory,
  consoleInputChanged,
} from '../../actions';

import {consoleErrorFactory} from '@factories/validations/errors';

test('evaluateConsoleEntry adds entry to history', () => {
  const expression = '1 + 1';
  const key = '123';
  const {history} = applyActions(evaluateConsoleEntry(expression, key));
  expect(history.size).toBe(1);
  expect(history.get(key)).toMatchObject({expression});
});

test('consoleValueProduced adds value to existing entry', () => {
  const value = 2;
  const key = '123';
  const {history} = applyActions(
    evaluateConsoleEntry('1 + 1', key),
    consoleValueProduced(key, value),
  );

  expect(history.get(key)).toMatchObject({value});
});

test('consoleErrorProduced adds error to existing entry', () => {
  const key = '123';
  const error = consoleErrorFactory.build();
  const {history} = applyActions(
    evaluateConsoleEntry('1 + bogus', key),
    consoleErrorProduced(key, 123456789, error),
  );

  expect(history.get(key).error).toMatchObject(Error.fromJS(error));
});

test('consoleInputChanged updates currentInputValue', () => {
  const value = '3';
  const {currentInputValue} = applyActions(consoleInputChanged(value));

  expect(currentInputValue).toEqual(value);
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

describe('previousConsoleHistory', () => {
  it('moves cursor from current input to previous entry', () => {
    const secondExpression = 'var bar';
    const consoleInput = 'va';
    const state = applyActions(
      evaluateConsoleEntry('var foo', '1'),
      evaluateConsoleEntry(secondExpression, '2'),
      consoleInputChanged(consoleInput),
      previousConsoleHistory(),
    );

    expect(state).toMatchObject({
      currentInputValue: secondExpression,
      nextConsoleEntry: consoleInput,
      historyEntryIndex: 1,
    });
  });

  it('moves cursor from previous entry to earlier entry', () => {
    const firstExpression = 'var foo';
    const consoleInput = 'va';
    const state = applyActions(
      evaluateConsoleEntry(firstExpression, '1'),
      evaluateConsoleEntry('var bar', '2'),
      consoleInputChanged(consoleInput),
      previousConsoleHistory(),
      previousConsoleHistory(),
    );

    expect(state).toMatchObject({
      currentInputValue: firstExpression,
      nextConsoleEntry: consoleInput,
      historyEntryIndex: 2,
    });
  });
});

describe('nextConsoleHistory', () => {
  it('moves from previous entry to more recent previous entry', () => {
    const secondExpression = 'var bar';
    const consoleInput = 'va';
    const state = applyActions(
      evaluateConsoleEntry('var foo', '1'),
      evaluateConsoleEntry(secondExpression, '2'),
      consoleInputChanged(consoleInput),
      previousConsoleHistory(),
      previousConsoleHistory(),
      nextConsoleHistory(),
    );

    expect(state).toMatchObject({
      historyEntryIndex: 1,
      nextConsoleEntry: consoleInput,
      currentInputValue: secondExpression,
    });
  });

  it('moves from most recent entry to in-progress expression', () => {
    const consoleInput = 'va';
    const state = applyActions(
      evaluateConsoleEntry('var foo', '1'),
      evaluateConsoleEntry('var bar', '2'),
      consoleInputChanged(consoleInput),
      previousConsoleHistory(),
      nextConsoleHistory(),
    );

    expect(state).toMatchObject({
      historyEntryIndex: 0,
      currentInputValue: consoleInput,
    });
    expect(state.nextConsoleEntry).toBeNil();
  });
});

function applyActions(...actions) {
  return reduce(actions, (state, action) => reducer(state, action), undefined);
}
