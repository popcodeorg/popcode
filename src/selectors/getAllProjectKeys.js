import {createSelector} from 'reselect';
import isNull from 'lodash-es/isNull';

export default createSelector(
  state => state.get('projects'),
  projects => projects.
    sort((...args) => {
      const [firstProj, secondProj] = args;
      const firstProjUpdateTime = firstProj.updatedAt;
      const secondProjUpdateTime = secondProj.updatedAt;
      const isFirstProjNull = isNull(firstProjUpdateTime);
      const isSecondProjNull = isNull(secondProjUpdateTime);
      if (isFirstProjNull && isSecondProjNull) {
        return 0;
      }
      if (isFirstProjNull) {
        return -1;
      }
      if (isSecondProjNull) {
        return 1;
      }
      return secondProjUpdateTime - firstProjUpdateTime;
    }).
    keySeq().
    toJS(),
);
