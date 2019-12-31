import {createLogic} from 'redux-logic';

import {editorReady} from '../actions/instrumentation';
import {loadMixpanel} from '../clients/mixpanel';

export function makeInstrumentEnvironmentReady() {
  let hasTracked = false;

  return createLogic({
    type: editorReady,

    validate(_, allow, reject) {
      if (hasTracked) {
        reject();
      } else {
        hasTracked = true;
        allow();
      }
    },

    async process({
      action: {
        payload: {timestamp},
      },
    }) {
      const mixpanel = await loadMixpanel();
      mixpanel.track('Environment Ready', {Timestamp: timestamp});
    },
  });
}

export default makeInstrumentEnvironmentReady();
