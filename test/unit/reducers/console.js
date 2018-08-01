import {OrderedMap} from 'immutable';
import partial from 'lodash-es/partial';
import test from 'tape';

import {ConsoleEntry, ConsoleError} from '../../../src/records';
import {
  consoleErrorProduced,
  consoleLogProduced,
  consoleValueProduced,
  evaluateConsoleEntry,
  setPreviousHistoryIndex,
  setCurrentConsoleInput,
} from '../../../src/actions';
import reducerTest from '../../helpers/reducerTest';
import reducer from '../../../src/reducers/console';

const initialState = {
  history: new OrderedMap(),
  previousHistoryIndex: 0,
  previousConsoleInput: '',
};

test('evaluateConsoleEntry', reducerTest(
  reducer,
  initialState,
  partial(evaluateConsoleEntry, '1+1', '123'),
  {
    previousHistoryIndex: 0,
    previousConsoleInput: '',
    history: new OrderedMap({123: new ConsoleEntry({expression: '1+1'})}),
  },
));

test('consoleValueProduced', reducerTest(
  reducer,
  {
    previousHistoryIndex: 0,
    previousConsoleInput: '',
    history: new OrderedMap({123: new ConsoleEntry({expression: '1+1'})}),
  },
  partial(consoleValueProduced, '123', 2, 123456789),
  {
    history: new OrderedMap({
      123: new ConsoleEntry({
        expression: '1+1',
        value: 2,
        evaluatedByCompiledProjectKey: 123456789,
      }),
    }),
  },
));

test('consoleErrorProduced', reducerTest(
  reducer,
  {
    previousHistoryIndex: 0,
    previousConsoleInput: '',
    history: new OrderedMap({
      123: new ConsoleEntry({expression: 'bogus + 1'}),
    }),
  },
  partial(
    consoleErrorProduced,
    '123',
    'NameError',
    'bogus is not defined',
    123456789,
  ),
  {
    previousHistoryIndex: 0,
    previousConsoleInput: '',
    history: new OrderedMap({
      123: new ConsoleEntry({
        expression: 'bogus + 1',
        error: new ConsoleError({
          name: 'NameError',
          message: 'bogus is not defined',
        }),
        evaluatedByCompiledProjectKey: 123456789,
      }),
    }),
  },
));

test('consoleLogProduced', reducerTest(
  reducer,
  initialState,
  partial(consoleLogProduced, 'A console message', 123456789, '456'),
  {
    previousHistoryIndex: 0,
    previousConsoleInput: '',
    history: new OrderedMap({
      456: new ConsoleEntry({
        value: 'A console message',
        evaluatedByCompiledProjectKey: 123456789,
      }),
    }),
  },
));

test('setPreviousHistoryIndex', reducerTest(
  reducer,
  initialState,
  partial(setPreviousHistoryIndex, 1),
  {
    previousHistoryIndex: 1,
    previousConsoleInput: '',
    history: new OrderedMap(),
  },
));

test('setCurrentConsoleInput', reducerTest(
  reducer,
  initialState,
  partial(setCurrentConsoleInput, '3'),
  {
    previousHistoryIndex: 0,
    previousConsoleInput: '3',
    history: new OrderedMap(),
  },
));
