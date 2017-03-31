import filter from 'lodash/filter';
import find from 'lodash/find';
import get from 'lodash/get';
import map from 'lodash/map';
import values from 'lodash/values';
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

export function initializeCurrentProjectFromGist(gistData) {
  return (dispatch) => {
    const projectKey = generateProjectKey();
    const project = createProjectFromGist(projectKey, gistData);
    dispatch(loadCurrentProject(project));
  };
}

const projectLoaded = createAction(
  'PROJECT_LOADED',
  project => ({project}),
);

export function loadCurrentProject(project) {
  return (dispatch) => {
    dispatch(projectLoaded(project));
    dispatch(changeCurrentProject(project.projectKey));
  };
}

function createProjectFromGist(projectKey, gistData) {
  const files = values(gistData.files);
  const popcodeJson = parsePopcodeJson(files);
  return {
    projectKey,
    sources: {
      html: get(find(files, {language: 'HTML'}), 'content', ''),
      css: map(filter(files, {language: 'CSS'}), 'content').join('\n\n'),
      javascript: map(filter(files, {language: 'JavaScript'}), 'content').
        join('\n\n'),
    },
    enabledLibraries: popcodeJson.enabledLibraries || [],
    updatedAt: Date.now(),
  };
}

function parsePopcodeJson(files) {
  const popcodeJsonFile = find(files, {filename: 'popcode.json'});
  if (!popcodeJsonFile) {
    return {};
  }
  return JSON.parse(get(popcodeJsonFile, 'content', '{}'));
}

function generateProjectKey() {
  const date = new Date();
  return (date.getTime() * 1000 + date.getMilliseconds()).toString();
}
