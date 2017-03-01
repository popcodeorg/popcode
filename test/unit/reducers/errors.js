import test from 'tape';
import {
  changeCurrentProject,
  projectCreated,
  validatedSource,
} from '../../../src/actions/projects';
import reduceErrors from '../../../src/reducers/errors';

const sampleError = {reason: 'bad-code'};

const initialState = reduceErrors(undefined, {type: null});
const stateWithErrors = reduceErrors(
  initialState,
  validatedSource('css', [sampleError]),
);
const stateWithNoErrors = reduceErrors(
  initialState,
  validatedSource('css', []),
);

test('validatedSource', (t) => {
  t.test('with errors', (assert) => {
    assert.plan(2);
    assert.equal(stateWithErrors.getIn(['css', 'state']), 'failed');
    assert.deepEqual(
      stateWithErrors.getIn(['css', 'items']).toJS(),
      [sampleError],
    );
  });

  t.test('with no errors', (assert) => {
    assert.plan(2);

    assert.equal(stateWithNoErrors.getIn(['css', 'state']), 'passed');
    assert.deepEqual(stateWithNoErrors.getIn(['css', 'items']).toJS(), []);
  });
});

test('projectCreated', (assert) => {
  assert.plan(2);
  const stateAfterNewProject = reduceErrors(
    stateWithErrors,
    projectCreated('12345'),
  );
  assert.equal(
    stateAfterNewProject.getIn(['css', 'state']),
    'passed',
  );
  assert.deepEqual(
    stateAfterNewProject.getIn(['css', 'items']).toJS(),
    [],
  );
});

test('changeCurrentProject', (assert) => {
  assert.plan(1);
  const stateAfterProjectChange = reduceErrors(
    stateWithErrors,
    changeCurrentProject('12345'),
  );
  assert.equal(
    stateAfterProjectChange.getIn(['css', 'state']),
    'validating',
  );
});
