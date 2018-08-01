import {OrderedMap} from 'immutable';

import {ConsoleEntry, ConsoleError} from '../records';

const initialState = {
  history: new OrderedMap(),
  previousHistoryIndex: 0,
  previousConsoleInput: '',
};

export default function console(stateIn, {type, payload, meta}) {
  let state = stateIn;
  if (state === undefined) {
    state = initialState;
  }

  switch (type) {
    case 'CONSOLE_VALUE_PRODUCED':
      return {
        ...state,
        history: state.history.update(
          payload.key,
          input => input.set(
            'value',
            payload.value,
          ).set(
            'evaluatedByCompiledProjectKey',
            payload.compiledProjectKey,
          ),
        ),
      };
    case 'CONSOLE_ERROR_PRODUCED':
      return {
        ...state,
        history: state.history.update(
          payload.key,
          input => input.set(
            'error',
            new ConsoleError({name: payload.name, message: payload.message}),
          ).set(
            'evaluatedByCompiledProjectKey',
            payload.compiledProjectKey,
          ),
        ),
      };
    case 'EVALUATE_CONSOLE_ENTRY':
      return payload.trim(' ') === '' ? state : {
        ...state,
        history: state.history.set(
          meta.key,
          new ConsoleEntry({expression: payload}),
        ),
      };
    case 'CLEAR_CONSOLE_ENTRIES':
      return initialState;
    case 'CONSOLE_LOG_PRODUCED':
      return {
        ...state,
        history: state.history.set(
          meta.key,
          new ConsoleEntry({
            value: payload.value,
            evaluatedByCompiledProjectKey: payload.compiledProjectKey,
          }),
        ),
      };
    case 'SET_PREVIOUS_HISTORY_INDEX':
      return {
        ...state,
        previousHistoryIndex: payload.index,
      };
    case 'SET_CURRENT_CONSOLE_INPUT':
      return {
        ...state,
        previousConsoleInput: payload.input,
      };
    default:
      return state;
  }
}
