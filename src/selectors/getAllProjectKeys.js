import {createSelector} from 'reselect';
import isNull from 'lodash-es/isNull';

export default createSelector(
  state => state.get('projects'),
  projects => projects.
    sort((...args) => {
      const [firstProj, secondProj] = args;
      if (isNull(firstProj.updatedAt)) {
        return -1;
      }
      if (isNull(secondProj.updatedAt)) {
        return 1;
      }
      return secondProj.updatedAt - firstProj.updatedAt;
    }).
    keySeq().
    toJS(),
);
