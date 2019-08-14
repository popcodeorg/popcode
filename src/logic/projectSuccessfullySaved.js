import {createLogic} from 'redux-logic';
import delay from 'delay';

import {showSaveIndicator, hideSaveIndicator} from '../actions/ui';

export default createLogic({
  type: 'PROJECT_SUCCESSFULLY_SAVED',
  debounce: 1000,
  async process(data, dispatch, done) {
    dispatch(showSaveIndicator());
    await delay(1000);
    dispatch(hideSaveIndicator());
    done();
  },
});
