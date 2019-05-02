import inRange from 'lodash-es/inRange';

import {ConsoleState, ConsoleEntry, Error} from '../records';

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

export default function console(stateIn, {type, payload, meta}) {
  let state = stateIn;
  if (state === undefined) {
    state = initialState;
  }

  switch (type) {
    case 'CONSOLE_VALUE_PRODUCED':
      return state.updateIn(
        ['history', payload.key],
        input => input.set(
          'value',
          payload.value,
        ).set(
          'evaluatedByCompiledProjectKey',
          payload.compiledProjectKey,
        ),
      );
    case 'CONSOLE_ERROR_PRODUCED':
      return state.updateIn(
        ['history', payload.key],
        input => input.set(
          'error',
          Error.fromJS(payload.error),
        ).set(
          'evaluatedByCompiledProjectKey',
          payload.compiledProjectKey,
        ),
      );
    case 'EVALUATE_CONSOLE_ENTRY':
      return payload.trim(' ') === '' ? state : state.setIn(
        ['history', meta.key],
        new ConsoleEntry({expression: payload}),
      ).
        delete('currentInputValue').
        delete('nextConsoleEntry').
        delete('historyEntryIndex');
    case 'CLEAR_CONSOLE_ENTRIES':
      return initialState;
    case 'CONSOLE_INPUT_CHANGED':
      return state.set('currentInputValue', payload.value);
    case 'CONSOLE_LOG_BATCH_PRODUCED':
      return state.update(
        'history',
        history => history.withMutations((map) => {
          payload.entries.forEach(({value, compiledProjectKey, key}) => {
            map.set(key, new ConsoleEntry({
              value,
              evaluatedByCompiledProjectKey: compiledProjectKey,
            }));
          });
        }),
      );
    case 'PREVIOUS_CONSOLE_HISTORY': {
      const historyIndex = state.historyEntryIndex + 1;

      return updateConsoleForHistoryIndex(
        setNextConsoleEntry(state, historyIndex),
        historyIndex,
      );
    }
    case 'NEXT_CONSOLE_HISTORY':
      return updateConsoleForHistoryIndex(state, state.historyEntryIndex - 1);
    default:
      return state;
  }
}
