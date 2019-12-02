import retryingFailedImports from '../../util/retryingFailedImports';
import {validatedSource} from '../actions/errors';

async function importValidations() {
  return retryingFailedImports(() =>
    import(
      /* webpackChunkName: "mainAsync" */
      '../../validations'
    ),
  );
}

export default async ({language, source, projectAttributes}, dispatch) => {
  const validations = await importValidations();
  const validate = validations[language];
  const validationErrors = await validate(source, projectAttributes);
  await dispatch(validatedSource(language, validationErrors));
};
