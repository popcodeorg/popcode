import {fromJS} from 'immutable';

import validateCurrentProject from '../validateCurrentProject';
import {validatedSource} from '../../actions/errors';
import {
  changeCurrentProject as changeCurrentProjectAction,
  gistImported as gistImportedAction,
  toggleLibrary as toggleLibraryAction,
} from '../../actions/projects';

import {
  snapshotImported as snapshotImportedAction,
  projectRestoredFromLastSession as projectRestoredFromLastSessionAction,
} from '../../actions/clients';

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

  [
    changeCurrentProjectAction,
    gistImportedAction,
    snapshotImportedAction,
    projectRestoredFromLastSessionAction,
    toggleLibraryAction,
  ].forEach(async action => {
    const dispatch = await testLogic(action('123'), {
      state,
    });

    expect(dispatch).toHaveBeenCalledWith(
      validatedSource('html', mockValidationErrors),
    );
    expect(dispatch).toHaveBeenCalledWith(
      validatedSource('css', mockValidationErrors),
    );
  });
});
