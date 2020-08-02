import {List} from 'immutable';

import partial from 'lodash-es/partial';

import {addRuntimeError, validatedSource} from '../../actions/errors';
import {
  changeCurrentProject,
  gistImported,
  projectCreated,
  toggleLibrary,
  updateProjectSource,
} from '../../actions/projects';
import {Error, ErrorList, ErrorReport} from '../../records';

import reducer from '../errors';

import {deprecated_reducerTest as reducerTest} from './migratedKarmaTestHelpers';

import {githubGistFactory} from '@factories/clients/github';

describe('errors', () => {
  const sampleError = new Error({reason: 'bad-code'});
  const validatingErrorList = new ErrorList({state: 'validating'});
  const states = {
    noErrors: new ErrorReport(),

    errors: new ErrorReport().set(
      'css',
      new ErrorList({
        items: new List([sampleError]),
        state: 'validation-error',
      }),
    ),

    validating: new ErrorReport({
      html: validatingErrorList,
      css: validatingErrorList,
      javascript: validatingErrorList,
    }),
  };

  describe('validatedSource', () => {
    test(
      'with errors',
      reducerTest(
        reducer,
        states.noErrors,
        partial(
          validatedSource,
          'css',
          states.errors.getIn(['css', 'items']).toJS(),
        ),
        states.errors,
        'sets state to validation-error with errors',
      ),
    );

    test(
      'with no errors',
      reducerTest(
        reducer,
        states.errors,
        partial(validatedSource, 'css', []),
        states.noErrors,
        'sets state to passed with empty errors',
      ),
    );
  });

  test(
    'projectCreated',
    reducerTest(
      reducer,
      states.errors,
      partial(projectCreated, '12345'),
      states.noErrors,
    ),
  );

  test(
    'changeCurrentProject',
    reducerTest(
      reducer,
      states.errors,
      partial(changeCurrentProject, '12345'),
      states.validating,
    ),
  );

  test(
    'gistImported',
    reducerTest(
      reducer,
      states.noErrors,
      partial(gistImported, '12345', githubGistFactory.build({html: ''})),
      states.validating,
    ),
  );

  test(
    'updateProjectSource',
    reducerTest(
      reducer,
      states.noErrors,
      partial(updateProjectSource, '12345', 'css', 'bogus', Date.now()),
      states.noErrors.setIn(['css', 'state'], 'validating'),
    ),
  );

  test(
    'toggleLibrary',
    reducerTest(
      reducer,
      states.noErrors,
      partial(toggleLibrary, '12345', 'jquery'),
      states.validating,
    ),
  );

  test(
    'addRuntimeError',
    reducerTest(
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
    ),
  );
});
