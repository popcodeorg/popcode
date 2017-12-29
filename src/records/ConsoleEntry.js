import {Record} from 'immutable';

export default Record({
  expression: null,
  value: null,
  error: null,
  evaluatedByCompiledProjectKey: null,
  isConsoleLog: false
}, 'ConsoleEntry');
