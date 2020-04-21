import {createLogic} from 'redux-logic';

import {applicationLoaded} from '../actions';
import {loadMixpanel} from '../clients/mixpanel';

export default createLogic({
  type: applicationLoaded,

  async process({action: {payload: {isExperimental, remoteConfig} = {}}}) {
    const mixpanel = await loadMixpanel();
    const payload = {
      'Experimental Mode': Boolean(isExperimental),
    };
    for (const [name, value] of Object.entries(remoteConfig)) {
      payload[`Remote Config: ${name}`] = value;
    }
    mixpanel.register(payload);
  },
});
