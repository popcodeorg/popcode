import {fromJS} from 'immutable';

import validateProjectOnChange from '../validateProjectOnChange';
import {validatedSource} from '../../actions/errors';
import {updateProjectSource as updateProjectSourceAction} from '../../actions/projects';

import {makeTestLogic} from './helpers';

jest.mock('../../analyzers');

const mockValidationErrors = {
  css: 'invalid CSS selector',
  html: 'closing tag missing',
};

const mockValidate = jest.fn(() => mockValidationErrors);

jest.mock('../../util/retryingFailedImports', () =>
  jest.fn(() => ({
    css: mockValidate,
    html: mockValidate,
    javascript: mockValidate,
  })),
);

test('should validate project on change', async () => {
  const state = fromJS({
    projects: {
      123: {
        sources: {
          html: '',
          css: '',
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
    validatedSource('css', mockValidationErrors),
  );
});
