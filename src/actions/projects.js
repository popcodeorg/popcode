import {createAction} from 'redux-actions';

export const projectCreated = createAction(
  'PROJECT_CREATED',
  projectKey => ({projectKey}),
);

export const createProject = createAction('CREATE_PROJECT');

export const changeCurrentProject = createAction(
  'CHANGE_CURRENT_PROJECT',
  projectKey => ({projectKey}),
);

export const projectSourceEdited = createAction(
  'PROJECT_SOURCE_EDITED',
  (projectKey, language, newValue) => ({projectKey, language, newValue}),
  (_projectKey, _language, _newValue, timestamp) => ({timestamp}),
);

export const gistImported = createAction(
  'GIST_IMPORTED',
  (projectKey, gistData) => ({projectKey, gistData}),
);

export const gistNotFound = createAction(
  'GIST_NOT_FOUND',
  gistId => ({gistId}),
);

export const gistImportError = createAction(
  'GIST_IMPORT_ERROR',
  gistId => ({gistId}),
);

export const projectLoaded = createAction(
  'PROJECT_LOADED',
  project => ({project}),
);

export function loadCurrentProject(project) {
  return (dispatch) => {
    dispatch(projectLoaded(project));
    dispatch(changeCurrentProject(project.projectKey));
  };
}
