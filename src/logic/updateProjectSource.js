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

export default createLogic({
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

    const validations = await importValidations();
    const validate = validations[language];
    const validationErrors = await validate(newValue, analyzer);
    await dispatch(validatedSource(language, validationErrors));
    done();
  },
});
