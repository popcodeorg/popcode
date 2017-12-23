import {OrderedMap} from 'immutable';
import partial from 'lodash/partial';
import test from 'tape';
import {ConsoleEntry, ConsoleError} from '../../../src/records';
import {
  consoleErrorProduced,
  consoleLogProduced,
  consoleValueProduced,
  evaluateConsoleEntry,
} from '../../../src/actions';
import reducerTest from '../../helpers/reducerTest';
import reducer from '../../../src/reducers/console';

const initialState = new OrderedMap();

test('evaluateConsoleEntry', reducerTest(
  reducer,
  initialState,
  partial(evaluateConsoleEntry, '1+1', '123'),
  new OrderedMap({123: new ConsoleEntry({expression: '1+1'})}),
));

test('consoleValueProduced', reducerTest(
  reducer,
  new OrderedMap({123: new ConsoleEntry({expression: '1+1'})}),
  partial(consoleValueProduced, '123', 2, 123456789),
  new OrderedMap({
    123: new ConsoleEntry({
      expression: '1+1',
      value: 2,
      evaluatedByCompiledProjectKey: 123456789,
    }),
  }),
));

test('consoleErrorProduced', reducerTest(
  reducer,
  new OrderedMap({123: new ConsoleEntry({expression: 'bogus + 1'})}),
  partial(
    consoleErrorProduced,
    '123',
    'NameError',
    'bogus is not defined',
    123456789,
  ),
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
));

test('consoleLogProduced', reducerTest(
  reducer,
  initialState,
  partial(consoleLogProduced, 'A console message', 123456789, '456'),
  new OrderedMap({
    456: new ConsoleEntry({
      value: 'A console message',
      evaluatedByCompiledProjectKey: 123456789,
    }),
  }),
));
