import {createLogic} from 'redux-logic';
import map from 'lodash-es/map';

import Analyzer from '../analyzers';
import {getCurrentProject} from '../selectors';

import validateSource from './helpers/validateSource';

export default createLogic({
  type: [
    'CHANGE_CURRENT_PROJECT',
    'GIST_IMPORTED',
    'SNAPSHOT_IMPORTED',
    'PROJECT_RESTORED_FROM_LAST_SESSION',
    'TOGGLE_LIBRARY',
  ],
  latest: true,
  async process({getState}, dispatch, done) {
    const state = getState();
    const currentProject = getCurrentProject(state);
    const analyzer = new Analyzer(currentProject);

    const validatePromises = map(
      Reflect.ownKeys(currentProject.sources),
      language =>
        validateSource(
          {
            language,
            source: currentProject.sources[language],
            projectAttributes: analyzer,
          },
          dispatch,
          getState,
        ),
    );

    await Promise.all(validatePromises);
    done();
  },
});
