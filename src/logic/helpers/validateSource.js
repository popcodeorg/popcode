import retryingFailedImports from '../../util/retryingFailedImports';
import {validatedSource} from '../../actions/errors';
import {getCurrentProject} from '../../selectors';

function importValidations() {
  return retryingFailedImports(() =>
    import(
      /* webpackChunkName: "mainAsync" */
      '../../validations'
    ),
  );
}

export default async function validateSource(
  {language, source, projectAttributes},
  dispatch,
  getState,
) {
  const validations = await importValidations();
  const validate = validations[language];
  const validationErrors = await validate(source, projectAttributes);
  const state = getState();
  const currentProject = getCurrentProject(state);
  if (currentProject.sources[language] === source) {
    dispatch(validatedSource(language, validationErrors));
  }
}
