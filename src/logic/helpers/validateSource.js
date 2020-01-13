import retryingFailedImports from '../../util/retryingFailedImports';
import {validatedSource} from '../../actions/errors';

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
) {
  const validations = await importValidations();
  const validate = validations[language];
  const validationErrors = await validate(source, projectAttributes);
  dispatch(validatedSource(language, validationErrors));
}
