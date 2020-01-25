import {
  projectRestoredFromLastSession as projectRestoredFromLastSessionAction,
  snapshotImported as snapshotImportedAction,
} from '../../actions/clients';
import {validatedSource} from '../../actions/errors';
import {
  changeCurrentProject as changeCurrentProjectAction,
  gistImported as gistImportedAction,
  toggleLibrary as toggleLibraryAction,
  updateProjectSource as updateProjectSourceAction,
} from '../../actions/projects';
import validateProject from '../validateProject';

import {applyActions, makeTestLogic} from './helpers';

import {firebaseProjectFactory} from '@factories/data/firebase';
import {consoleErrorFactory} from '@factories/validations/errors';

jest.mock('../../analyzers');

const mockCssValidationErrors = [
  consoleErrorFactory.build({
    text: 'You have a starting { but no ending } to go with it.',
  }),
];

const mockHtmlValidationErrors = [
  consoleErrorFactory.build({
    text: 'Closing tag missing',
  }),
];

jest.mock('../../validations', () => ({
  css: jest.fn(() => mockCssValidationErrors),
  html: jest.fn(() => mockHtmlValidationErrors),
  javascript: jest.fn(() => []),
}));

test('should validate current project', async () => {
  const testLogic = makeTestLogic(validateProject);

  [
    changeCurrentProjectAction,
    gistImportedAction,
    snapshotImportedAction,
    projectRestoredFromLastSessionAction,
    toggleLibraryAction,
  ].forEach(async action => {
    const mockProject = firebaseProjectFactory.build();
    const state = applyActions(
      projectRestoredFromLastSessionAction(mockProject),
    );

    const dispatch = await testLogic(action(mockProject.projectKey), {
      state,
    });

    expect(dispatch).toHaveBeenCalledWith(
      validatedSource('html', mockHtmlValidationErrors),
    );
    expect(dispatch).toHaveBeenCalledWith(
      validatedSource('css', mockCssValidationErrors),
    );
  });
});

test('UPDATE_PROJECT_SOURCE should validate newSource', async () => {
  const mockProject = firebaseProjectFactory.build();
  const state = applyActions(projectRestoredFromLastSessionAction(mockProject));

  const testLogic = makeTestLogic(validateProject);
  const dispatch = await testLogic(
    updateProjectSourceAction(mockProject.projectKey, 'css', 'div {'),
    {state},
  );

  expect(dispatch).toHaveBeenCalledWith(
    validatedSource('css', mockCssValidationErrors),
  );
});
