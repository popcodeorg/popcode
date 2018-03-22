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

function hideUnhidePayload(projectKey, componentType, language) {
  return {projectKey, componentType, language};
}

function hideUnhideMeta(
  _projectKey,
  _componentType,
  _language,
  timestamp = Date.now(),
) {
  return {timestamp};
}

export const hideComponent = createAction(
  'HIDE_COMPONENT',
  hideUnhidePayload,
  hideUnhideMeta,
);

export const unhideComponent = createAction(
  'UNHIDE_COMPONENT',
  hideUnhidePayload,
  hideUnhideMeta,
);

export const toggleComponent = createAction(
  'TOGGLE_COMPONENT',
  hideUnhidePayload,
  hideUnhideMeta,
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

export const projectsLoaded = createAction('PROJECTS_LOADED');
