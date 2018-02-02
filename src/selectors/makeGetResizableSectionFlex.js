import {createSelector} from 'reselect';

export default function makeGetResizableSectionFlex() {
  return createSelector(
    (state, section) =>
      state.getIn(['ui', 'workspace', section, 'flex']),
    resizableSectionFlex => resizableSectionFlex.toJS(),
  );
}
