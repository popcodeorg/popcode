import {createSelector} from 'reselect';

export default function makeIsDraggingDivider() {
  return createSelector(
    (state, section) =>
      state.getIn(['ui', 'workspace', section, 'isDraggingDivider']),
    isDraggingDivider => isDraggingDivider,
  );
}
