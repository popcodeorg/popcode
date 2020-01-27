import map from 'lodash-es/map';
import {createLogic} from 'redux-logic';

import {validatedSource} from '../actions/errors';
import Analyzer from '../analyzers';
import {getCurrentProject} from '../selectors';
import retryingFailedImports from '../util/retryingFailedImports';

function importValidations() {
  return retryingFailedImports(() =>
    import(
      /* webpackChunkName: "mainAsync" */
      '../validations'
    ),
  );
}

async function validateSource({language, source, projectAttributes}, dispatch) {
  const validations = await importValidations();
  const validate = validations[language];
  const validationErrors = await validate(source, projectAttributes);
  dispatch(validatedSource(language, validationErrors));
}

async function validateSources({sources, projectAttributes}, dispatch) {
  const validatePromises = map(Reflect.ownKeys(sources), language =>
    validateSource(
      {
        language,
        source: sources[language],
        projectAttributes,
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
    const state = getState();
    const currentProject = getCurrentProject(state);
    const projectAttributes = new Analyzer(currentProject);

    if (type === 'UPDATE_PROJECT_SOURCE') {
      await validateSource(
        {language, source: newValue, projectAttributes},
        dispatch,
      );
    } else {
      await validateSources(
        {sources: currentProject.sources, projectAttributes},
        dispatch,
      );
    }

    done();
  },
});
