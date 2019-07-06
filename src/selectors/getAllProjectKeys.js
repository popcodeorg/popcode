import {createSelector} from 'reselect';
import isNull from 'lodash-es/isNull';

export default createSelector(
  state => state.get('projects'),
  projects =>
    projects
      .sort(
        (
          {updatedAt: firstProjectUpdatedAt},
          {updatedAt: secondProjectUpdatedAt},
        ) => {
          const isFirstProjectPristine = isNull(firstProjectUpdatedAt);
          const isSecondProjectPristine = isNull(secondProjectUpdatedAt);
          if (isFirstProjectPristine) {
            if (isSecondProjectPristine) {
              return 0;
            }
            return -1;
          }
          if (isSecondProjectPristine) {
            return 1;
          }
          return secondProjectUpdatedAt - firstProjectUpdatedAt;
        },
      )
      .keySeq()
      .toJS(),
);
