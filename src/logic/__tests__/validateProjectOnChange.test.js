import {fromJS} from 'immutable';

import {validatedSource} from '../../actions/errors';
import {updateProjectSource as updateProjectSourceAction} from '../../actions/projects';
import validateProjectOnChange from '../validateProjectOnChange';

import {makeTestLogic} from './helpers';

jest.mock('../../analyzers');

const mockCssValidationErrors = [
  {
    text: 'You have a starting { but no ending } to go with it.',
  },
];

jest.mock('../../util/retryingFailedImports', () =>
  jest.fn(() => ({
    css: jest.fn(() => mockCssValidationErrors),
    html: jest.fn(() => []),
    javascript: jest.fn(() => []),
  })),
);

test('should validate project on change', async () => {
  const state = fromJS({
    currentProject: {projectKey: '123'},
    projects: {
      123: {
        sources: {
          html: '',
          css: 'div {',
          javascript: '',
        },
      },
    },
  });

  const testLogic = makeTestLogic(validateProjectOnChange);
  const dispatch = await testLogic(
    updateProjectSourceAction('123', 'css', 'div {'),
    {state},
  );

  expect(dispatch).toHaveBeenCalledWith(
    validatedSource('css', mockCssValidationErrors),
  );
});
