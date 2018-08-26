import inRange from 'lodash-es/inRange';

import {ConsoleState, ConsoleEntry, ConsoleError} from '../records';

const initialState = new ConsoleState();

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
    case 'NAVIGATE_CONSOLE_HISTORY': {
      const newHistoryEntryIndex = payload.direction === 'UP' ?
        state.historyEntryIndex + 1 :
        state.historyEntryIndex - 1;

      const expressionHistory = state.history.toList().
        map(entry => entry.expression).
        filter(expression => expression !== null).
        concat(state.nextConsoleEntry).
        reverse();

      if (!inRange(newHistoryEntryIndex, expressionHistory.size)) {
        return state;
      }

      const expression = expressionHistory.get(newHistoryEntryIndex);

      return state.
        set('historyEntryIndex', newHistoryEntryIndex).
        set('currentInputValue', expression).
        withMutations((record) => {
          const firstUp = (
            newHistoryEntryIndex === 1 &&
            payload.direction === 'UP'
          );

          if (firstUp) {
            return record.set('nextConsoleEntry', record.currentInputValue);
          }
          return record;
        });
    }
    default:
      return state;
  }
}
