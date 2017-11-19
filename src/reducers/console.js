import {OrderedMap} from 'immutable';
import {ConsoleEntry, ConsoleError} from '../records';

const initialState = new OrderedMap();

export default function console(stateIn, {type, payload, meta}) {
  let state = stateIn;
  if (state === undefined) {
    state = initialState;
  }

  switch (type) {
    case 'CONSOLE_VALUE_PRODUCED':
      return state.update(
        payload.key,
        input => input.set('value', payload.value),
      );
    case 'CONSOLE_ERROR_PRODUCED':
      return state.update(
        payload.key,
        input => input.set(
          'error',
          new ConsoleError({name: payload.name, message: payload.message}),
        ),
      );
    case 'EVALUATE_CONSOLE_ENTRY':
      return state.set(
        meta.key,
        new ConsoleEntry({expression: payload}),
      );
    default:
      return state;
  }
}
