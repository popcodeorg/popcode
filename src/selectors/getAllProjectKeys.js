import {createSelector} from 'reselect';

export default createSelector(
  state => state.get('projects'),
  projects => projects.
    sort((firstProj, secondProj) => {
      if (firstProj.updatedAt === null) {
        return -1;
      }
      if (secondProj.updatedAt === null) {
        return 1;
      }
      return secondProj.updatedAt - firstProj.updatedAt;
    }).
    keySeq().
    toJS(),
);
