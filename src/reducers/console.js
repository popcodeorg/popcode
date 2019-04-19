import constant from 'lodash-es/constant';
import inRange from 'lodash-es/inRange';
import {handleActions} from 'redux-actions';


import {ConsoleState, ConsoleEntry, ConsoleError} from '../records';

import {
  consoleValueProduced,
  consoleErrorProduced,
  evaluateConsoleEntry,
  clearConsoleEntries,
  previousConsoleHistory,
  nextConsoleHistory,
  consoleInputChanged,
  consoleLogBatchProduced,
} from '../actions/console';

const initialState = new ConsoleState();

function updateConsoleForHistoryIndex(state, index) {
  const expressionHistory = state.history.toList().
    map(entry => entry.expression).
    filter(expression => expression !== null).
    concat(state.nextConsoleEntry).
    reverse();

  if (!inRange(index, expressionHistory.size)) {
    return state;
  }

  const expression = expressionHistory.get(index);

  return state.
    set('historyEntryIndex', index).
    set('currentInputValue', expression);
}

function setNextConsoleEntry(state, historyIndex) {
  const firstUp = historyIndex === 1;

  if (firstUp && !state.history.isEmpty()) {
    return state.set('nextConsoleEntry', state.currentInputValue);
  }

  return state;
}

export default handleActions({
  [consoleValueProduced]: (
    state,
    {payload: {compiledProjectKey, key, value}},
  ) => state.updateIn(
    ['history', key],
    input => input.set('value', value).
      set('evaluatedByCompiledProjectKey', compiledProjectKey),
  ),

  [consoleErrorProduced]: (
    state,
    {payload: {compiledProjectKey, key, message, name}},
  ) => state.updateIn(
    ['history', key],
    input => input.set('error', new ConsoleError({name, message})).
      set('evaluatedByCompiledProjectKey', compiledProjectKey),
  ),

  [evaluateConsoleEntry]: (state, {payload: expression, meta: {key}}) =>
    expression.trim(' ') === '' ?
      state :
      state.setIn(['history', key], new ConsoleEntry({expression})).
        delete('currentInputValue').
        delete('nextConsoleEntry').
        delete('historyEntryIndex'),

  [clearConsoleEntries]: constant(initialState),

  [consoleInputChanged]: (state, {payload: value}) =>
    state.set('currentInputValue', value),

  [consoleLogBatchProduced]: (state, {payload: {entries}}) =>
    state.update(
      'history',
      history => history.withMutations((map) => {
        entries.forEach(({value, compiledProjectKey, key}) => {
          map.set(key, new ConsoleEntry({
            value,
            evaluatedByCompiledProjectKey: compiledProjectKey,
          }));
        });
      }),
    ),

  [previousConsoleHistory]: (state) => {
    const historyIndex = state.historyEntryIndex + 1;

    return updateConsoleForHistoryIndex(
      setNextConsoleEntry(state, historyIndex),
      historyIndex,
    );
  },

  [nextConsoleHistory]: state =>
    updateConsoleForHistoryIndex(state, state.historyEntryIndex - 1),
}, initialState);

