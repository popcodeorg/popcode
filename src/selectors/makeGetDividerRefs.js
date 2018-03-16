import {createSelector} from 'reselect';

export default function makeGetDividerRefs() {
  return createSelector(
    (state, section) =>
      state.getIn(['ui', 'workspace', section, 'dividerRefs']),
    getDividerRefs => getDividerRefs.toJS(),
  );
}
