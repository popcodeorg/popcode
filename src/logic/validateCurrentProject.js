import {createLogic} from 'redux-logic';
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
  async process({getState}, dispatch, done) {
    const state = getState();
    const currentProject = getCurrentProject(state);
    const analyzer = new Analyzer(currentProject);

    const validatePromises = [];
    for (const language of Reflect.ownKeys(currentProject.sources)) {
      const source = currentProject.sources[language];
      validatePromises.push(
        validateSource(
          {language, source, projectAttributes: analyzer},
          dispatch,
        ),
      );
    }
    await Promise.all(validatePromises);
    done();
  },
});
