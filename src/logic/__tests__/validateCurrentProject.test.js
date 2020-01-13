import validateCurrentProject from '../validateCurrentProject';
import {validatedSource} from '../../actions/errors';
import {changeCurrentProject as changeCurrentProjectAction} from '../../actions/projects';
import {makeTestLogic} from './helpers';
const {fromJS} = require('immutable');

jest.mock('../../analyzers');

const mockValidationErrors = {
  css: 'invalid CSS selector',
  html: 'closing tag missing',
};

const mockValidate = jest.fn(x => mockValidationErrors);

jest.mock('../../util/retryingFailedImports', () =>
  jest.fn(x => ({
    css: mockValidate,
    html: mockValidate,
    javascript: mockValidate,
  })),
);

test('should validate current project', async () => {
  const state = fromJS({
    currentProject: {projectKey: '123'},
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
  const testLogic = makeTestLogic(validateCurrentProject);
  const dispatch = await testLogic(changeCurrentProjectAction('123'), {state});

  expect(dispatch).toHaveBeenCalledWith(
    validatedSource('html', mockValidationErrors),
  );
  expect(dispatch).toHaveBeenCalledWith(
    validatedSource('css', mockValidationErrors),
  );
});
