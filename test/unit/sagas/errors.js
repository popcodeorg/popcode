import test from 'tape';
import isEqual from 'lodash/isEqual';
import {createMockTask} from 'redux-saga/utils';
import {testSaga} from 'redux-saga-test-plan';
import Scenario from '../../helpers/Scenario';
import {javascript} from '../../../src/validations';
import {
  updateProjectSource,
  toggleLibrary,
} from '../../../src/actions/projects';
import {validatedSource} from '../../../src/actions/errors';
import {
  toggleLibrary as toggleLibrarySaga,
  updateProjectSource as updateProjectSourceSaga,
  validateCurrentProject as validateCurrentProjectSaga,
  validateSource as validateSourceSaga,
  importValidations,
} from '../../../src/sagas/errors';

test('validateCurrentProject()', (assert) => {
  const tasks = new Map();
  const scenario = new Scenario();
  let selector;
  assert.ok(isEqual(scenario.analyzer, scenario.analyzer));
  const saga = testSaga(validateCurrentProjectSaga, tasks).
    next().inspect((effect) => {
      assert.ok(effect.SELECT, 'invokes select effect');
      ({selector} = effect.SELECT);
    });

  const args = [selector(scenario.state)];
  for (const language of ['html', 'css', 'javascript']) {
    saga.next(args.shift()).fork(
      validateSourceSaga,
      tasks,
      {
        payload: {
          language,
          source: scenario.project.getIn(['sources', language]),
          projectAttributes: scenario.analyzer,
        },
      },
    );
  }
  saga.next().isDone();

  assert.end();
});

test('validateSource()', (t) => {
  const projectAttributes = {containsExternalScript: false};
  const language = 'javascript';
  const source = 'alert("hi");';
  const errors = [{error: 'test'}];
  const action = {payload: {language, source, projectAttributes}};

  t.test('validation completes', (assert) => {
    const tasks = new Map();
    const task = createMockTask();
    testSaga(validateSourceSaga, tasks, action).
      next().call(importValidations).
      next({javascript}).fork(javascript, source, projectAttributes).
      next(task).join(task).
      next(errors).put(validatedSource(language, errors)).
      next().isDone();
    assert.end();
  });

  t.test('another validation initiated', (assert) => {
    const tasks = new Map();
    const firstTask = createMockTask();
    const secondTask = createMockTask();
    testSaga(validateSourceSaga, tasks, action).
      next().call(importValidations).
      next({javascript}).fork(javascript, source, projectAttributes).
      next(firstTask).join(firstTask);

    testSaga(validateSourceSaga, tasks, action).
      next().cancel(firstTask).
      next().call(importValidations).
      next({javascript}).fork(javascript, source, projectAttributes).
      next(secondTask).join(secondTask).
      next(errors).put(validatedSource(language, errors)).
      next().isDone();

    assert.end();
  });
});

test('updateProjectSource()', (assert) => {
  const tasks = new Map();
  const scenario = new Scenario();
  const language = 'javascript';
  const source = 'alert("hi");';
  testSaga(
    updateProjectSourceSaga,
    tasks,
    updateProjectSource(scenario.projectKey, language, source),
  ).
    next().select().
    next(scenario.state).call(
      validateSourceSaga,
      tasks,
      {payload: {language, source, projectAttributes: scenario.analyzer}},
    ).
    next().isDone();

  assert.end();
});

test('toggleLibrary()', (assert) => {
  const tasks = new Map();
  const scenario = new Scenario();
  testSaga(
    toggleLibrarySaga,
    tasks,
    toggleLibrary(scenario.projectKey, 'jquery'),
  ).
    next().call(validateCurrentProjectSaga, tasks).
    next().isDone();

  assert.end();
});
