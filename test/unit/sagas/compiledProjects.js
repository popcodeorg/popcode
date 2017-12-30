import test from 'tape';
import {testSaga} from 'redux-saga-test-plan';
import {
  validatedSource as validatedSourceSaga,
} from '../../../src/sagas/compiledProjects';
import {getCurrentProject, getErrors} from '../../../src/selectors';
import {projectCompiled, projectCompilationFailed} from '../../../src/actions';
import compileProject from '../../../src/util/compileProject';
import Bugsnag from '../../../src/util/Bugsnag';
import {errors} from '../../helpers/referenceStates';
import {project as projectFactory} from '../../helpers/factory';

test('validatedSource', (t) => {
  t.test('with errors', (assert) => {
    testSaga(validatedSourceSaga).
      next().select(getErrors).
      next(errors.errors.toJS()).isDone();

    assert.end();
  });

  t.test('with no errors', (assert) => {
    const clock = sinon.useFakeTimers();
    const preview = {source: '<html></html>'};
    startCompilation(assert).
      next(preview).put(projectCompiled(preview, Date.now()));

    clock.restore();
    assert.end();
  });

  t.test('with uncaught compilation error', (assert) => {
    const error = new Error('Compilation failed.');
    startCompilation(assert).
      throw(error).call([Bugsnag, 'notifyException'], error).
      next().put(projectCompilationFailed(error)).
      next().isDone();

    assert.end();
  });

  function startCompilation() {
    const project = projectFactory();

    return testSaga(validatedSourceSaga).
      next().select(getErrors).
      next(errors.noErrors.toJS()).select(getCurrentProject).
      next(project).call(
        compileProject,
        project,
        {isInlinePreview: true},
      );
  }
});
