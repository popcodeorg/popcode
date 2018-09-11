import {OrderedMap, Record} from 'immutable';

export default Record({
  name: null,
  id: null,
  assertions: new OrderedMap(),
  allTestsPassed: false,
}, 'TestResult');
