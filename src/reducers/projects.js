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
  const {projectKey, componentKey, hiddenUIComponent} = payload;
  return state.setIn(
    [projectKey, 'hiddenUIComponents', componentKey],
    hiddenUIComponent || new HiddenUIComponent({componentType: componentKey}),
  ).setIn([projectKey, 'updatedAt'], timestamp);
}

function unhideComponent(state, payload, timestamp) {
  const {projectKey, componentKey} = payload;
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
            componentKey: action.payload.componentKey,
          },
          action.meta.timestamp,
        );
    }
    return projects;
  });
}

export default function reduceProjects(stateIn, {type, payload, meta}) {
  let state;

  if (stateIn === undefined) {
    state = emptyMap;
  } else {
    state = stateIn;
  }

  switch (type) {
    case 'PROJECTS_LOADED':
      return payload.reduce(addProject, state);

    case 'UPDATE_PROJECT_SOURCE':
      return state.setIn(
        [payload.projectKey, 'sources', payload.language],
        payload.newValue,
      ).setIn(
        [payload.projectKey, 'updatedAt'],
        meta.timestamp,
      );

    case 'UPDATE_PROJECT_INSTRUCTIONS':
      return state.setIn(
        [payload.projectKey, 'instructions'],
        payload.newValue,
      ).setIn(
        [payload.projectKey, 'updatedAt'],
        meta.timestamp,
      );

    case 'PROJECT_CREATED':
      return removePristineExcept(state, payload.projectKey).set(
        payload.projectKey,
        new Project({projectKey: payload.projectKey}),
      );

    case 'CHANGE_CURRENT_PROJECT':
      return removePristineExcept(state, payload.projectKey);

    case 'SNAPSHOT_IMPORTED':
      return addProject(
        state,
        assign(
          {},
          payload.project,
          {projectKey: payload.projectKey, updatedAt: null},
        ),
      );

    case 'GIST_IMPORTED':
      return importGist(
        state,
        payload.projectKey,
        payload.gistData,
      );

    case 'PROJECT_RESTORED_FROM_LAST_SESSION':
      return addProject(state, payload);

    case 'TOGGLE_LIBRARY':
      return state.updateIn(
        [payload.projectKey, 'enabledLibraries'],
        (enabledLibraries) => {
          const {libraryKey} = payload;
          if (enabledLibraries.has(libraryKey)) {
            return enabledLibraries.delete(libraryKey);
          }
          return enabledLibraries.add(libraryKey);
        },
      ).setIn(
        [payload.projectKey, 'updatedAt'],
        meta.timestamp,
      );

    case 'TOGGLE_COMPONENT':
      if (state.getIn(
        [payload.projectKey, 'hiddenUIComponents'],
      ).has(payload.componentKey)) {
        return unhideComponent(state, payload, meta.timestamp);
      }
      return hideComponent(state, payload, meta.timestamp);

    case 'STORE_HIDDEN_LINE':
      return state.mergeIn([
        payload.projectKey,
        'hiddenUIComponents',
        payload.componentKey,
      ], {
        line: payload.line,
        column: payload.column,
      });

    default:
      return state;
  }
}
