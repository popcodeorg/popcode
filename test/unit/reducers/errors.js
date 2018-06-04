import test from 'tape';
import partial from 'lodash-es/partial';
import {List} from 'immutable';

import {Error, ErrorList} from '../../../src/records';
import reducerTest from '../../helpers/reducerTest';
import {errors as states} from '../../helpers/referenceStates';
import {gistData} from '../../helpers/factory';
import {
  changeCurrentProject,
  gistImported,
  projectCreated,
  toggleLibrary,
  updateProjectSource,
} from '../../../src/actions/projects';
import {
  addRuntimeError,
  validatedSource,
} from '../../../src/actions/errors';
import reducer from '../../../src/reducers/errors';

test('validatedSource', (t) => {
  t.test('with errors', reducerTest(
    reducer,
    states.noErrors,
    partial(
      validatedSource,
      'css',
      states.errors.getIn(['css', 'items']).toJS(),
    ),
    states.errors,
    'sets state to validation-error with errors',
  ));

  t.test('with no errors', reducerTest(
    reducer,
    states.errors,
    partial(validatedSource, 'css', []),
    states.noErrors,
    'sets state to passed with empty errors',
  ));
});

test('projectCreated', reducerTest(
  reducer,
  states.errors,
  partial(projectCreated, '12345'),
  states.noErrors,
));

test('changeCurrentProject', reducerTest(
  reducer,
  states.errors,
  partial(changeCurrentProject, '12345'),
  states.validating,
));

test('gistImported', reducerTest(
  reducer,
  states.noErrors,
  partial(gistImported, '12345', gistData({html: ''})),
  states.validating,
));

test('updateProjectSource', reducerTest(
  reducer,
  states.noErrors,
  partial(updateProjectSource, '12345', 'css', 'bogus', Date.now()),
  states.noErrors.setIn(['css', 'state'], 'validating'),
));

test('toggleLibrary', reducerTest(
  reducer,
  states.noErrors,
  partial(toggleLibrary, '12345', 'jquery'),
  states.validating,
));

test('addRuntimeError', reducerTest(
  reducer,
  states.noErrors,
  partial(addRuntimeError, 'javascript', {reason: 'code-explode'}),
  states.noErrors.set(
    'javascript',
    new ErrorList({
      state: 'runtime-error',
      items: new List([Error.fromJS({reason: 'code-explode'})]),
    }),
  ),
));
