import reduce from 'lodash-es/reduce';

import reducer from '../../ui';

export function applyActions(...actions) {
  return reduce(actions, (state, action) => reducer(state, action), undefined);
}
