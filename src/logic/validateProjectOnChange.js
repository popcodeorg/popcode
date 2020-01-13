import {createLogic} from 'redux-logic';

import Analyzer from '../analyzers';
import {getCurrentProject} from '../selectors';

import validateSource from './helpers/validateSource';

export default createLogic({
  type: 'UPDATE_PROJECT_SOURCE',
  latest: true,
  async process(
    {
      getState,
      action: {
        payload: {language, newValue},
      },
    },
    dispatch,
    done,
  ) {
    const state = getState();
    const analyzer = new Analyzer(getCurrentProject(state));

    await validateSource(
      {language, source: newValue, projectAttributes: analyzer},
      dispatch,
      getState,
    );
    done();
  },
});
