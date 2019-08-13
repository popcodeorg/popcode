import {Map, Record} from 'immutable';

export default Record(
  {
    type: null,
    severity: 'notice',
    metadata: new Map(),
  },
  'Notification',
);
