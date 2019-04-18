import {createLogic} from 'redux-logic';

import {showSaveIndicator, hideSaveIndicator} from '../actions/ui';

export default createLogic({
  type: 'PROJECT_SUCCESSFULLY_SAVED',
  debounce: 1000,
  async process(data, dispatch, done) {
    dispatch(showSaveIndicator());
    await new Promise(resolve => setTimeout(resolve, 1000));
    dispatch(hideSaveIndicator());
    done();
  },
});
