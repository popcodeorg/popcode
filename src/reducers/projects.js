import Immutable from 'immutable';
import assign from 'lodash/assign';
import isNil from 'lodash/isNil';
import filter from 'lodash/filter';
import find from 'lodash/find';
import get from 'lodash/get';
import map from 'lodash/map';
import sortBy from 'lodash/sortBy';
import values from 'lodash/values';

import {Project, HiddenUIComponent} from '../records';
import {isPristineProject} from '../util/projectUtils';

const emptyMap = new Immutable.Map();

function addProject(state, project) {
  return state.set(project.projectKey, Project.fromJS(project));
}

function removePristineExcept(state, keepProjectKey) {
  return state.filter((project, projectKey) => (
    projectKey === keepProjectKey || !isPristineProject(project)
  ));
}

function hideComponent(state, payload, timestamp) {
  const {projectKey, language, componentType} = payload;
  const componentKey = language || componentType;
  return state.setIn(
    [projectKey, 'hiddenUIComponents', componentKey],
    new HiddenUIComponent({componentType, language}),
  ).setIn([projectKey, 'updatedAt'], timestamp);
}

function unhideComponent(state, payload, timestamp) {
  const {projectKey, language, componentType} = payload;
  const componentKey = language || componentType;
  return state.updateIn(
    [projectKey, 'hiddenUIComponents'],
    hiddenUIComponents => hiddenUIComponents.delete(componentKey),
  ).setIn([projectKey, 'updatedAt'], timestamp);
}

function contentForLanguage(files, language) {
  const filesForLanguage = sortBy(
    filter(files, {language}),
    file => file.filename,
  );
  return map(filesForLanguage, 'content').join('\n\n');
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
        css: contentForLanguage(files, 'CSS'),
        javascript: contentForLanguage(files, 'JavaScript'),
      },
      enabledLibraries: popcodeJson.enabledLibraries || [],
      hiddenUIComponents: popcodeJson.hiddenUIComponents || {},
      instructions: contentForLanguage(files, 'Markdown'),
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
          {
            projectKey: stateIn.getIn(['currentProject', 'projectKey']),
            componentType: action.payload.componentKey,
          },
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
    case 'PROJECTS_LOADED':
      return action.payload.reduce(addProject, state);

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
        new Project({projectKey: action.payload.projectKey}),
      );

    case 'CHANGE_CURRENT_PROJECT':
      return removePristineExcept(state, action.payload.projectKey);

    case 'SNAPSHOT_IMPORTED':
      return addProject(
        state,
        assign(
          {},
          action.payload.project,
          {projectKey: action.payload.projectKey, updatedAt: null},
        ),
      );

    case 'GIST_IMPORTED':
      return importGist(
        state,
        action.payload.projectKey,
        action.payload.gistData,
      );

    case 'PROJECT_RESTORED_FROM_LAST_SESSION':
      return addProject(state, action.payload);

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

    case 'STORE_HIDDEN_LINE':
      return state.mergeIn([
        action.payload.projectKey,
        'hiddenUIComponents',
        action.payload.componentKey,
      ], {
        line: action.payload.line,
        column: action.payload.column,
      });

    case 'HIDE_COMPONENT':
      return hideComponent(
        state,
        action.payload,
        action.meta.timestamp,
      );

    case 'UNHIDE_COMPONENT':
      return unhideComponent(
        state,
        action.payload,
        action.meta.timestamp,
      );

    case 'TOGGLE_COMPONENT':
      if (state.getIn(
        [action.payload.projectKey, 'hiddenUIComponents'],
      ).has(action.payload.language || action.payload.componentType)) {
        return unhideComponent(
          state,
          action.payload,
          action.meta.timestamp,
        );
      }
      return hideComponent(
        state,
        action.payload,
        action.meta.timestamp,
      );

    default:
      return state;
  }
}
