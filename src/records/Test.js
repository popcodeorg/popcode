import {OrderedMap, Record} from 'immutable';

export default Record({
  isTestResultsPaneOpen: false,
  isTestCreatorPaneOpen: false,
  shouldRunTests: false,
  testResults: new OrderedMap(),
}, 'Test');
