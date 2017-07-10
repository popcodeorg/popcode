import Immutable from 'immutable';
import isNil from 'lodash/isNil';
import filter from 'lodash/filter';
import find from 'lodash/find';
import get from 'lodash/get';
import map from 'lodash/map';
import values from 'lodash/values';

import {isPristineProject} from '../util/projectUtils';
import HTML_TEMPLATE from '../../templates/new.html';

const emptyMap = new Immutable.Map();

const newProject = Immutable.fromJS({
  sources: {
    html: HTML_TEMPLATE,
    css: '',
    javascript: '',
  },
  enabledLibraries: new Immutable.Set(),
  hiddenUIComponents: new Immutable.Set(),
});

function projectToImmutable(project) {
  return Immutable.fromJS(project).merge({
    enabledLibraries: new Immutable.Set(project.enabledLibraries),
    hiddenUIComponents: new Immutable.Set(project.hiddenUIComponents),
  });
}

function addProject(state, project) {
  return state.set(project.projectKey, projectToImmutable(project));
}

function removePristineExcept(state, keepProjectKey) {
  return state.filter((project, projectKey) => (
    projectKey === keepProjectKey || !isPristineProject(project)
  ));
}

function unhideComponent(state, projectKey, component, timestamp) {
  return state.updateIn(
    [projectKey, 'hiddenUIComponents'],
    hiddenUIComponents => hiddenUIComponents.delete(component),
  ).setIn([projectKey, 'updatedAt'], timestamp);
}

function importGist(state, projectKey, gistData) {
  const files = values(gistData.files);
  const popcodeJsonFile = find(files, {filename: 'popcode.json'});
  const popcodeJson = JSON.parse(get(popcodeJsonFile, 'content', '{}'));

  return addProject(
    state,
    {
      projectKey,
      sources: {
        html: get(find(files, {language: 'HTML'}), 'content', ''),
        css: map(filter(files, {language: 'CSS'}), 'content').join('\n\n'),
        javascript: map(filter(files, {language: 'JavaScript'}), 'content').
          join('\n\n'),
      },
      enabledLibraries: popcodeJson.enabledLibraries || [],
      hiddenUIComponents: popcodeJson.hiddenUIComponents || [],
    },
  );
}

export function reduceRoot(stateIn, action) {
  return stateIn.update('projects', (projects) => {
    switch (action.type) {
      case 'USER_LOGGED_OUT': {
        const currentProjectKey =
          stateIn.getIn(['currentProject', 'projectKey']);

        if (isNil(currentProjectKey)) {
          return new Immutable.Map();
        }

        return new Immutable.Map().set(
          currentProjectKey,
          projects.get(currentProjectKey),
        );
      }
      case 'FOCUS_LINE':
        return unhideComponent(
          projects,
          stateIn.getIn(['currentProject', 'projectKey']),
          `editor.${action.payload.language}`,
          action.meta.timestamp,
        );
    }
    return projects;
  });
}

export default function reduceProjects(stateIn, action) {
  let state;

  if (stateIn === undefined) {
    state = emptyMap;
  } else {
    state = stateIn;
  }

  switch (action.type) {
    case 'PROJECT_LOADED':
      return addProject(state, action.payload.project);

    case 'UPDATE_PROJECT_SOURCE':
      return state.setIn(
        [action.payload.projectKey, 'sources', action.payload.language],
        action.payload.newValue,
      ).setIn(
        [action.payload.projectKey, 'updatedAt'],
        action.meta.timestamp,
      );

    case 'PROJECT_CREATED':
      return removePristineExcept(state, action.payload.projectKey).set(
        action.payload.projectKey,
        newProject.set('projectKey', action.payload.projectKey),
      );

    case 'CHANGE_CURRENT_PROJECT':
      return removePristineExcept(state, action.payload.projectKey);

    case 'GIST_IMPORTED':
      return importGist(
        state,
        action.payload.projectKey,
        action.payload.gistData,
      );

    case 'TOGGLE_LIBRARY':
      return state.updateIn(
        [action.payload.projectKey, 'enabledLibraries'],
        (enabledLibraries) => {
          const {libraryKey} = action.payload;
          if (enabledLibraries.has(libraryKey)) {
            return enabledLibraries.delete(libraryKey);
          }
          return enabledLibraries.add(libraryKey);
        },
      ).setIn(
        [action.payload.projectKey, 'updatedAt'],
        action.meta.timestamp,
      );

    case 'HIDE_COMPONENT':
      return state.updateIn(
        [action.payload.projectKey, 'hiddenUIComponents'],
        hiddenUIComponents =>
          hiddenUIComponents.add(action.payload.componentName),
      ).setIn(
        [action.payload.projectKey, 'updatedAt'],
        action.meta.timestamp,
      );

    case 'UNHIDE_COMPONENT':
      return unhideComponent(
        state,
        action.payload.projectKey,
        action.payload.componentName,
        action.meta.timestamp,
      );

    default:
      return state;
  }
}
