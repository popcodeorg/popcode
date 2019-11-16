import {createLogic} from 'redux-logic';
import Analyzer from '../analyzers';
import {getCurrentProject} from '../selectors';
import {validatedSource} from '../actions/errors';
import retryingFailedImports from '../util/retryingFailedImports';

export async function importValidations() {
  return retryingFailedImports(() =>
    import(
      /* webpackChunkName: "mainAsync" */
      '../validations'
    ),
  );
}

const validateSource = async (
  {language, source, projectAttributes},
  dispatch,
) => {
  const validations = await importValidations();
  const validate = validations[language];
  const validationErrors = await validate(source, projectAttributes);
  await dispatch(validatedSource(language, validationErrors));
};

const validateCurrentProject = createLogic({
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

const updateProjectSource = createLogic({
  type: 'UPDATE_PROJECT_SOURCE',
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
    );
    done();
  },
});

export default [updateProjectSource, validateCurrentProject];
