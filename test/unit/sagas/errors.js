import test from 'tape';
import {call, fork, put} from 'redux-saga/effects';
import Scenario from '../../helpers/Scenario';
import validations from '../../../src/validations';
import {validatedSource} from '../../../src/actions/errors';
import {
  validateCurrentProject as validateCurrentProjectSaga,
  validateSource as validateSourceSaga,
} from '../../../src/sagas/errors';

test('validateProject()', (assert) => {
  assert.plan(5);
  const scenario = new Scenario();
  const saga = validateCurrentProjectSaga();
  const selectEffect = saga.next().value;
  assert.ok(selectEffect.SELECT, 'invokes select effect');

  const {selector} = selectEffect.SELECT;
  const effects = [
    saga.next(selector(scenario.state)).value,
    saga.next().value,
    saga.next().value,
  ];

  ['html', 'css', 'javascript'].forEach((language, i) => {
    const source = scenario.project.getIn(['sources', language]);
    assert.deepEqual(
      effects[i],
      fork(validateSourceSaga, language, source, scenario.analyzer),
      `calls validateSource saga for ${language}`,
    );
  });

  assert.ok(saga.next().done, 'generator completes');
});

test('validateSource()', (assert) => {
  assert.plan(3);
  const projectAttributes = {containsExternalScript: false};
  const language = 'javascript';
  const source = 'alert("hi");';
  const saga = validateSourceSaga(language, source, projectAttributes);
  const callValidate = saga.next().value;

  assert.deepEqual(
    callValidate,
    call(validations.javascript, source, projectAttributes),
    'calls appropriate validation with source and attributes',
  );

  const errors = [{error: 'test'}];
  const putValidatedSource = saga.next(errors).value;

  assert.deepEqual(
    putValidatedSource,
    put(validatedSource(language, errors)),
    'dispatches VALIDATED_SOURCE action with errors',
  );

  assert.ok(saga.next().done, 'generator completes');
});
