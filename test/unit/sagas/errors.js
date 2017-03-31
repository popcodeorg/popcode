import test from 'tape';
import isEqual from 'lodash/isEqual';
import {testSaga} from 'redux-saga-test-plan';
import Scenario from '../../helpers/Scenario';
import validations from '../../../src/validations';
import {validatedSource} from '../../../src/actions/errors';
import {
  validateCurrentProject as validateCurrentProjectSaga,
  validateSource as validateSourceSaga,
} from '../../../src/sagas/errors';

test('validateProject()', (assert) => {
  const scenario = new Scenario();
  let selector;
  assert.ok(isEqual(scenario.analyzer, scenario.analyzer));
  const saga = testSaga(validateCurrentProjectSaga).
    next().inspect((effect) => {
      assert.ok(effect.SELECT, 'invokes select effect');
      selector = effect.SELECT.selector;
    });

  const args = [selector(scenario.state)];
  for (const language of ['html', 'css', 'javascript']) {
    saga.next(args.shift()).fork(
      validateSourceSaga,
      language,
      scenario.project.getIn(['sources', language]),
      scenario.analyzer,
    );
  }
  saga.next().isDone();

  assert.end();
});

test('validateSource()', (assert) => {
  const projectAttributes = {containsExternalScript: false};
  const language = 'javascript';
  const source = 'alert("hi");';
  const errors = [{error: 'test'}];
  testSaga(validateSourceSaga, language, source, projectAttributes).
    next().call(validations.javascript, source, projectAttributes).
    next(errors).put(validatedSource(language, errors)).
    next().isDone();
  assert.end();
});
