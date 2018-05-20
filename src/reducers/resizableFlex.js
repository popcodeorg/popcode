import {handleActions} from 'redux-actions';
import {List, Map} from 'immutable';
import reduce from 'lodash-es/reduce';

const defaultState = new Map();

export default handleActions({
  UPDATE_RESIZABLE_FLEX: (state, {payload: {name, updates}}) => state.update(
    name,
    new List(),
    flexStateIn => reduce(
      updates,
      (flexState, {index, flexGrow}) => flexState.set(index, flexGrow),
      flexStateIn,
    ),
  ),
}, defaultState);
