import {List} from 'immutable';

export default function makeGetResizableFlexGrow(name) {
  return state => state.getIn(['resizableFlex', name], new List());
}
