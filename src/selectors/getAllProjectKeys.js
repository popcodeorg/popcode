import {createSelector} from 'reselect';
import isNull from 'lodash-es/isNull';

export default createSelector(
  state => state.get('projects'),
  projects => projects.
    sort((...args) => {
      const [firstProject, secondProject] = args;
      const firstProjectUpdatedAt = firstProject.updatedAt;
      const secondProjectUpdatedAt = secondProject.updatedAt;
      const isFirstProjectNull = isNull(firstProjectUpdatedAt);
      const isSecondProjectNull = isNull(secondProjectUpdatedAt);
      if (isFirstProjectNull && isSecondProjectNull) {
        return 0;
      }
      if (isFirstProjectNull) {
        return -1;
      }
      if (isSecondProjectNull) {
        return 1;
      }
      return secondProjectUpdatedAt - firstProjectUpdatedAt;
    }).
    keySeq().
    toJS(),
);
