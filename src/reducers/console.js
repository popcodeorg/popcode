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
      ).delete('currentInputValue').
        delete('nextConsoleEntry').
        delete('historyEntryIndex');
    case 'CONSOLE_ERROR_PRODUCED':
      return state.updateIn(['history', payload.key],
        input => input.set(
          'error',
          new ConsoleError({name: payload.name, message: payload.message}),
        ).set(
          'evaluatedByCompiledProjectKey',
          payload.compiledProjectKey,
        ),
      );
    case 'EVALUATE_CONSOLE_ENTRY':
      return payload.trim(' ') === '' ? state : state.updateIn(
        ['history', meta.key],
        () => new ConsoleEntry({expression: payload}),
      );
    case 'CLEAR_CONSOLE_ENTRIES':
      return initialState;
    case 'CONSOLE_CHANGE':
      return state.set('currentInputValue', payload.value);
    case 'CONSOLE_LOG_PRODUCED':
      return state.updateIn(
        ['history', meta.key],
        () => new ConsoleEntry({
          value: payload.value,
          evaluatedByCompiledProjectKey: payload.compiledProjectKey,
        }),
      );
    case 'NAVIGATE_CONSOLE_HISTORY': {
      const relevantHistory = state.history.toList().filter(
        entry => entry.expression !== null,
      );

      if (payload.direction === 'UP') {
        if (relevantHistory.size === 0 ||
            state.historyEntryIndex === relevantHistory.size) {
          return state;
        }
        const firstHistoryNavigation = state.historyEntryIndex === null;
        const newHistoryEntryIndex = firstHistoryNavigation ?
          1 : state.historyEntryIndex + 1;
        const historyIndex = relevantHistory.size - newHistoryEntryIndex;
        const {expression} = relevantHistory.get(historyIndex);
        const updatedState = state.
          set('historyEntryIndex', newHistoryEntryIndex).
          set('currentInputValue', expression);

        return firstHistoryNavigation ?
          updatedState.set('nextConsoleEntry', state.currentInputValue) :
          updatedState;
      }

      if (state.historyEntryIndex === null) {
        return state;
      }
      const newHistoryEntryIndex = state.historyEntryIndex - 1;
      if (newHistoryEntryIndex === 0) {
        return state.
          delete('historyEntryIndex').
          delete('nextConsoleEntry').
          set('currentInputValue', state.nextConsoleEntry);
      }
      const historyIndex = relevantHistory.size - newHistoryEntryIndex;
      const {expression} = relevantHistory.get(historyIndex);
      return state.
        set('historyEntryIndex', newHistoryEntryIndex).
        set('currentInputValue', expression);
    }
    default:
      return state;
  }
}
