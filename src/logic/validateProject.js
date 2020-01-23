import map from 'lodash-es/map';
import {createLogic} from 'redux-logic';

import Analyzer from '../analyzers';
import {getCurrentProject} from '../selectors';

import validateSource from './helpers/validateSource';

async function validateSources(sources, analyzer, dispatch) {
  const validatePromises = map(Reflect.ownKeys(sources), language =>
    validateSource(
      {
        language,
        source: sources[language],
        projectAttributes: analyzer,
      },
      dispatch,
    ),
  );

  await Promise.all(validatePromises);
}

export default createLogic({
  type: [
    'CHANGE_CURRENT_PROJECT',
    'GIST_IMPORTED',
    'SNAPSHOT_IMPORTED',
    'PROJECT_RESTORED_FROM_LAST_SESSION',
    'TOGGLE_LIBRARY',
    'UPDATE_PROJECT_SOURCE',
  ],
  latest: true,
  async process(
    {
      getState,
      action: {
        type,
        payload: {language, newValue},
      },
    },
    dispatch,
    done,
  ) {
    //PROBLEM: language is handled differently in each different block
    const state = getState();
    const currentProject = getCurrentProject(state);
    const analyzer = new Analyzer(currentProject);

    const sources =
      type === 'UPDATE_PROJECT_SOURCE'
        ? {[language]: newValue}
        : currentProject.sources;

    await validateSources(sources, analyzer, dispatch);
    done();
  },
});
