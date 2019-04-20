import {OrderedMap} from 'immutable';
import test from 'tape-catch';

import {ConsoleEntry, ConsoleState} from '../../../src/records';
import {
  nextConsoleHistory,
} from '../../../src/actions';
import reducerTest from '../../helpers/reducerTest';
import reducer from '../../../src/reducers/console';

const initialState = new ConsoleState();

const consoleStateWithHistory = initialState.set(
  'history',
  new OrderedMap({
    123: new ConsoleEntry({expression: '1'}),
    456: new ConsoleEntry({expression: '2'}),
  }),
);

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
