import {Record, OrderedMap} from 'immutable';

export default Record({
  history: new OrderedMap(),
  historyEntryIndex: null,
  nextConsoleEntry: null,
  currentInputValue: '',
}, 'ConsoleState');
