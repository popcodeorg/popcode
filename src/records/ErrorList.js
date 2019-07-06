import {List, Record} from 'immutable';

export default Record(
  {
    items: new List(),
    state: 'passed',
  },
  'ErrorList',
);
