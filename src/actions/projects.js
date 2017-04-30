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

export const updateProjectSource = createAction(
  'UPDATE_PROJECT_SOURCE',
  (projectKey, language, newValue) => ({projectKey, language, newValue}),
  (_projectKey, _language, _newValue, timestamp = Date.now()) => ({timestamp}),
);

export const toggleLibrary = createAction(
  'TOGGLE_LIBRARY',
  (projectKey, libraryKey) => ({projectKey, libraryKey}),
  (_projectKey, _libraryKey, timestamp = Date.now()) => ({timestamp}),
);

export const minimizeComponent = createAction(
  'MINIMIZE_COMPONENT',
  (projectKey, componentName) => ({projectKey, componentName}),
  (_projectKey, _componentName, timestamp = Date.now()) => ({timestamp}),
);

export const maximizeComponent = createAction(
  'MAXIMIZE_COMPONENT',
  (projectKey, componentName) => ({projectKey, componentName}),
  (_projectKey, _componentName, timestamp = Date.now()) => ({timestamp}),
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
