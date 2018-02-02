import {Record, List} from 'immutable';

export default Record({
  flex: new List(),
  isDraggingDivider: false,
  refs: new List(),
  dividerRefs: new List(),
}, 'FlexContainer');
