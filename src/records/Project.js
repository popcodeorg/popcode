import {Record, Set} from 'immutable';

import HTML_TEMPLATE from '../../templates/new.html';

const Sources = Record({
  html: HTML_TEMPLATE,
  css: '',
  javascript: '',
});

const ExternalLocations = Record({
  githubRepoName: null,
});

export default class Project extends Record({
  projectKey: null,
  sources: new Sources(),
  enabledLibraries: new Set(),
  hiddenUIComponents: new Set(['console']),
  updatedAt: null,
  instructions: '',
  externalLocations: new ExternalLocations(),
}) {
  static fromJS({
    projectKey = null,
    sources = {},
    enabledLibraries = [],
    hiddenUIComponents = [],
    updatedAt = null,
    instructions = '',
    externalLocations = {},
  }) {
    return new Project({
      projectKey,
      sources: new Sources(sources),
      enabledLibraries: new Set(enabledLibraries),
      hiddenUIComponents: new Set(hiddenUIComponents),
      updatedAt,
      instructions,
      externalLocations: new ExternalLocations(externalLocations),
    });
  }
}
