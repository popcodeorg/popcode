import {createSelector} from 'reselect';

export default function makeGetResizableSectionRefs() {
  return createSelector(
    (state, section) =>
      state.getIn(['ui', 'workspace', section, 'refs']),
    resizableSectionRefs => resizableSectionRefs.toJS(),
  );
}

