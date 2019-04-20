import {OrderedMap} from 'immutable';
import partial from 'lodash-es/partial';
import test from 'tape-catch';

import {ConsoleEntry, ConsoleState} from '../../../src/records';
import {
  consoleLogBatchProduced,
  nextConsoleHistory,
  previousConsoleHistory,
} from '../../../src/actions';
import reducerTest from '../../helpers/reducerTest';
import reducer from '../../../src/reducers/console';

const initialState = new ConsoleState();

test('consoleLogBatchProduced', reducerTest(
  reducer,
  initialState,
  partial(consoleLogBatchProduced, [
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
  ]),
  initialState.set(
    'history',
    new OrderedMap({
      123: new ConsoleEntry({
        value: 'Second console message',
        evaluatedByCompiledProjectKey: 987654321,
      }),
      456: new ConsoleEntry({
        value: 'A console message',
        evaluatedByCompiledProjectKey: 123456789,
      }),
    }),
  ),
));

const consoleStateWithHistory = initialState.set(
  'history',
  new OrderedMap({
    123: new ConsoleEntry({expression: '1'}),
    456: new ConsoleEntry({expression: '2'}),
  }),
);

test('previousConsoleHistory', reducerTest(
  reducer,
  consoleStateWithHistory.
    set('currentInputValue', '3'),
  previousConsoleHistory,
  consoleStateWithHistory.
    set('currentInputValue', '2').
    set('historyEntryIndex', 1).
    set('nextConsoleEntry', '3'),
));

test('nextConsoleHistory', reducerTest(
  reducer,
  consoleStateWithHistory.
    set('historyEntryIndex', 2),
  nextConsoleHistory,
  consoleStateWithHistory.
    set('currentInputValue', '2').
    set('historyEntryIndex', 1),
));

const consoleStateWithNext = consoleStateWithHistory.set(
  'nextConsoleEntry', '3',
);

test('nextConsoleHistory returns to nextConsoleEntry', reducerTest(
  reducer,
  consoleStateWithNext.
    set('currentInputValue', '2').
    set('historyEntryIndex', 1),
  nextConsoleHistory,
  consoleStateWithNext.
    set('currentInputValue', '3'),
));
