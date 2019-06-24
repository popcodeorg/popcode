import {createLogic} from 'redux-logic';

import {openLoginPrompt} from '../actions/ui';
import {saveProject} from '../actions/projects';
import {isUserAuthenticated} from '../selectors';

import saveCurrentProject from './shared/saveCurrentProject';

export default createLogic({
  type: saveProject.toString(),
  async process({getState}) {
    const state = getState();
    const isLoggedIn = isUserAuthenticated(state);
    if (isLoggedIn) {
      return saveCurrentProject(state);
    }
    return openLoginPrompt();
  },
});
