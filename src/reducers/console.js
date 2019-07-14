import constant from 'lodash-es/constant';
import inRange from 'lodash-es/inRange';
import isNil from 'lodash-es/isNil';
import {handleActions} from 'redux-actions';

import {ConsoleState, ConsoleEntry, Error} from '../records';

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
  const expressionHistory = state.history
    .toList()
    .map(entry => entry.expression)
    .filter(expression => expression !== null)
    .concat(state.nextConsoleEntry)
    .reverse();

  if (!inRange(index, expressionHistory.size)) {
    return state;
  }

  const expression = expressionHistory.get(index);

  const nextState = state
    .set('historyEntryIndex', index)
    .set('currentInputValue', expression);

  if (index === 0) {
    return nextState.delete('nextConsoleEntry');
  }

  if (isNil(state.nextConsoleEntry) && !state.history.isEmpty()) {
    return nextState.set('nextConsoleEntry', state.currentInputValue);
  }

  return nextState;
}

export default handleActions(
  {
    [consoleValueProduced]: (
      state,
      {payload: {compiledProjectKey, key, value}},
    ) =>
      state.updateIn(['history', key], input =>
        input
          .set('value', value)
          .set('evaluatedByCompiledProjectKey', compiledProjectKey),
      ),

    [consoleErrorProduced]: (
      state,
      {payload: {compiledProjectKey, key, error}},
    ) =>
      state.updateIn(['history', key], input =>
        input
          .set('error', Error.fromJS(error))
          .set('evaluatedByCompiledProjectKey', compiledProjectKey),
      ),

    [evaluateConsoleEntry]: (state, {payload: expression, meta: {key}}) =>
      expression.trim() === ''
        ? state
        : state
            .setIn(['history', key], new ConsoleEntry({expression}))
            .delete('currentInputValue')
            .delete('nextConsoleEntry')
            .delete('historyEntryIndex'),

    [clearConsoleEntries]: constant(initialState),

    [consoleInputChanged]: (state, {payload: {value}}) =>
      state.set('currentInputValue', value),

    [consoleLogBatchProduced]: (state, {payload: {entries}}) =>
      state.update('history', history =>
        history.withMutations(map => {
          entries.forEach(({value, compiledProjectKey, key}) => {
            map.set(
              key,
              new ConsoleEntry({
                value,
                evaluatedByCompiledProjectKey: compiledProjectKey,
              }),
            );
          });
        }),
      ),

    [previousConsoleHistory]: state => {
      const historyIndex = state.historyEntryIndex + 1;

      return updateConsoleForHistoryIndex(state, historyIndex);
    },

    [nextConsoleHistory]: state => {
      const historyIndex = state.historyEntryIndex - 1;
      return updateConsoleForHistoryIndex(state, historyIndex);
    },
  },
  initialState,
);
