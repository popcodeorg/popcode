import {createLogic} from 'redux-logic';

import {openLoginPrompt} from '../actions/ui';
import {isUserAuthenticated} from '../selectors';

import {saveCurrentProject} from './saveCurrentProject';

export default createLogic({
  type: 'SAVE_PROJECT',
  async process({getState}) {
    const state = getState();
    const isLoggedIn = await isUserAuthenticated(state);
    if (isLoggedIn) {
      return saveCurrentProject(state);
    }
    return openLoginPrompt();
  },
});
