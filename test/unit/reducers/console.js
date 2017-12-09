import {OrderedMap} from 'immutable';
import partial from 'lodash/partial';
import test from 'tape';
import {ConsoleEntry, ConsoleError} from '../../../src/records';
import {
  consoleErrorProduced,
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
  partial(consoleValueProduced, '123', 2),
  new OrderedMap({
    123: new ConsoleEntry({expression: '1+1', value: 2}),
  }),
));

test('consoleErrorProduced', reducerTest(
  reducer,
  new OrderedMap({123: new ConsoleEntry({expression: 'bogus + 1'})}),
  partial(consoleErrorProduced, '123', 'NameError', 'bogus is not defined'),
  new OrderedMap({
    123: new ConsoleEntry({
      expression: 'bogus + 1',
      error: new ConsoleError({
        name: 'NameError',
        message: 'bogus is not defined',
      }),
    }),
  }),
));
