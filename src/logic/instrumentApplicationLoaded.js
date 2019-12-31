import {createLogic} from 'redux-logic';

import {applicationLoaded} from '../actions';
import {loadMixpanel} from '../clients/mixpanel';

export default createLogic({
  type: applicationLoaded,

  async process({action: {payload: {isExperimental} = {}}}) {
    const mixpanel = await loadMixpanel();
    mixpanel.register({
      'Experimental Mode': Boolean(isExperimental),
    });
  },
});
