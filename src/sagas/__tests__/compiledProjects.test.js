import {advanceTo} from 'jest-date-mock';
import {testSaga} from 'redux-saga-test-plan';
import Immutable from 'immutable';
import {validatedSource as validatedSourceSaga} from '../compiledProjects';
import {getCurrentProject, getErrors} from '../../selectors';
import {projectCompilationFailed, projectCompiled} from '../../actions';
import compileProject from '../../util/compileProject';
import {bugsnagClient} from '../../util/bugsnag';
import {firebaseProjectFactory} from '@factories/data/firebase';
import {ErrorList, ErrorReport, Error as ValidationError} from '../../records';

const validatingErrorList = new ErrorList({state: 'validating'});

const sampleError = new ValidationError({reason: 'bad-code'});
const errors = {
  noErrors: new ErrorReport(),

  errors: new ErrorReport().set(
    'css',
    new ErrorList({
      items: new Immutable.List([sampleError]),
      state: 'validation-error',
    }),
  ),

  validating: new ErrorReport({
    html: validatingErrorList,
    css: validatingErrorList,
    javascript: validatingErrorList,
  }),
};

beforeEach(() => advanceTo());

describe('validatedSource', () => {
  test('with errors', () => {
    testSaga(validatedSourceSaga)
      .next()
      .select(getErrors)
      .next(errors.errors.toJS())
      .isDone();
  });

  test('with no errors', () => {
    const preview = {source: '<html></html>', sourceMap: {mappings: []}};
    startCompilation().next(preview).put(projectCompiled(preview, Date.now()));
  });

  test('with uncaught compilation error', () => {
    const error = new Error('Compilation failed.');
    startCompilation()
      .throw(error)
      .call([bugsnagClient, 'notify'], error)
      .next()
      .put(projectCompilationFailed(error))
      .next()
      .isDone();
  });

  function startCompilation() {
    const project = firebaseProjectFactory.build();

    return testSaga(validatedSourceSaga)
      .next()
      .select(getErrors)
      .next(errors.noErrors.toJS())
      .select(getCurrentProject)
      .next(project)
      .call(compileProject, project, {isInlinePreview: true});
  }
});
