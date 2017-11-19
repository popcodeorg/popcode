import {OrderedMap} from 'immutable';
import {ConsoleInput} from '../records';

const initialState = new OrderedMap();

export default function console(stateIn, {type, payload, meta}) {
  let state = stateIn;
  if (state === undefined) {
    state = initialState;
  }

  switch (type) {
    case 'EVALUATE_CONSOLE_INPUT':
      return state.set(
        meta.key,
        new ConsoleInput({expression: payload}),
      );
    default:
      return state;
  }
}
