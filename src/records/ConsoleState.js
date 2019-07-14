import {Record, OrderedMap} from 'immutable';

export default Record(
  {
    history: new OrderedMap(),
    historyEntryIndex: 0,
    nextConsoleEntry: null,
    currentInputValue: '',
  },
  'ConsoleState',
);
