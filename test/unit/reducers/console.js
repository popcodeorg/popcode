import {OrderedMap} from 'immutable';
import partial from 'lodash-es/partial';
import test from 'tape';

import {ConsoleEntry, ConsoleError, ConsoleState} from '../../../src/records';
import {
  consoleErrorProduced,
  consoleLogProduced,
  consoleValueProduced,
  evaluateConsoleEntry,
  navigateConsoleHistory,
} from '../../../src/actions';
import reducerTest from '../../helpers/reducerTest';
import reducer from '../../../src/reducers/console';

const initialState = new ConsoleState();

test('evaluateConsoleEntry', reducerTest(
  reducer,
  initialState,
  partial(evaluateConsoleEntry, '1+1', '123'),
  initialState.set(
    'history', new OrderedMap({123: new ConsoleEntry({expression: '1+1'})}),
  ),
));

test('consoleValueProduced', reducerTest(
  reducer,
  initialState.set(
    'history', new OrderedMap({123: new ConsoleEntry({expression: '1+1'})}),
  ),
  partial(consoleValueProduced, '123', 2, 123456789),
  initialState.set(
    'history', new OrderedMap({
      123: new ConsoleEntry({
        expression: '1+1',
        value: 2,
        evaluatedByCompiledProjectKey: 123456789,
      }),
    }),
  ),
));

test('consoleErrorProduced', reducerTest(
  reducer,
  initialState.set(
    'history',
    new OrderedMap({123: new ConsoleEntry({expression: 'bogus + 1'})}),
  ),
  partial(
    consoleErrorProduced,
    '123',
    'NameError',
    'bogus is not defined',
    123456789,
  ),
  initialState.set(
    'history',
    new OrderedMap({
      123: new ConsoleEntry({
        expression: 'bogus + 1',
        error: new ConsoleError({
          name: 'NameError',
          message: 'bogus is not defined',
        }),
        evaluatedByCompiledProjectKey: 123456789,
      }),
    }),
  ),
));

test('consoleLogProduced', reducerTest(
  reducer,
  initialState,
  partial(consoleLogProduced, 'A console message', 123456789, '456'),
  initialState.set(
    'history',
    new OrderedMap({
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

test('navigateConsoleHistory up', reducerTest(
  reducer,
  consoleStateWithHistory.
    set('currentInputValue', '3'),
  partial(navigateConsoleHistory, 'UP'),
  consoleStateWithHistory.
    set('currentInputValue', '2').
    set('historyEntryIndex', 1).
    set('nextConsoleEntry', '3'),
));

test('navigateConsoleHistory down', reducerTest(
  reducer,
  consoleStateWithHistory.
    set('historyEntryIndex', 2),
  partial(navigateConsoleHistory, 'DOWN'),
  consoleStateWithHistory.
    set('currentInputValue', '2').
    set('historyEntryIndex', 1),
));

test('navigateConsoleHistory down returns to nextConsoleEntry', reducerTest(
  reducer,
  consoleStateWithHistory.
    set('currentInputValue', '2').
    set('historyEntryIndex', 1).
    set('nextConsoleEntry', '3'),
  partial(navigateConsoleHistory, 'DOWN'),
  consoleStateWithHistory.
    set('currentInputValue', '3'),
));
