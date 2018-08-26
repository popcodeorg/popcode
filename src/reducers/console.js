import inRange from 'lodash-es/inRange';

import {ConsoleState, ConsoleEntry, ConsoleError} from '../records';

const initialState = new ConsoleState();

function updateConsoleForHistoryIndex(index, state) {
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

function setNextConsoleEntry(newHistoryEntryIndex, state) {
  const firstUp = newHistoryEntryIndex === 1;

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
          new ConsoleError({name: payload.name, message: payload.message}),
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
    case 'CONSOLE_LOG_PRODUCED':
      return state.setIn(
        ['history', meta.key],
        new ConsoleEntry({
          value: payload.value,
          evaluatedByCompiledProjectKey: payload.compiledProjectKey,
        }),
      );
    case 'PREVIOUS_CONSOLE_HISTORY': {
      const newHistoryEntryIndex = state.historyEntryIndex + 1;

      return updateConsoleForHistoryIndex(
        newHistoryEntryIndex,
        setNextConsoleEntry(state),
      );
    }
    case 'NEXT_CONSOLE_HISTORY': {
      const newHistoryEntryIndex = state.historyEntryIndex - 1;

      return updateConsoleForHistoryIndex(newHistoryEntryIndex, state);
    }
    default:
      return state;
  }
}
