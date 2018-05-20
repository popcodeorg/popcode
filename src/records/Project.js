import {Record, Set} from 'immutable';

import ProjectSources from './ProjectSources';

const ExternalLocations = Record({
  githubRepoName: null,
});

export default class Project extends Record({
  projectKey: null,
  sources: new ProjectSources(),
  enabledLibraries: new Set(),
  hiddenUIComponents: new Set(['console']),
  updatedAt: null,
  instructions: '',
  externalLocations: new ExternalLocations(),
  isArchived: false,
}) {
  static fromJS({
    projectKey = null,
    sources = {},
    enabledLibraries = [],
    hiddenUIComponents = [],
    updatedAt = null,
    instructions = '',
    externalLocations = {},
    isArchived = false,
  }) {
    return new Project({
      projectKey,
      sources: new ProjectSources(sources),
      enabledLibraries: new Set(enabledLibraries),
      hiddenUIComponents: new Set(hiddenUIComponents),
      updatedAt,
      instructions,
      externalLocations: new ExternalLocations(externalLocations),
      isArchived,
    });
  }
}
