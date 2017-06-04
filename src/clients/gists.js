import isEmpty from 'lodash/isEmpty';
import trim from 'lodash/trim';
import performWithRetries from '../util/performWithRetries';
import gitHub from '../services/gitHub';

function gistPerformWithRetries(perform, options = {}) {
  return performWithRetries(perform, ['Network Error'], options);
}

export function EmptyGistError(message) {
  this.name = 'EmptyGistError';
  this.message = message;
  this.stack = new Error().stack;
}
EmptyGistError.prototype = Object.create(Error.prototype);

function buildGistFromProject(project) {
  const files = {};
  if (trim(project.sources.html)) {
    files['index.html'] = {
      content: project.sources.html,
      language: 'HTML',
    };
  }
  if (trim(project.sources.css)) {
    files['styles.css'] = {
      content: project.sources.css,
      language: 'CSS',
    };
  }
  if (trim(project.sources.javascript)) {
    files['script.js'] = {
      content: project.sources.javascript,
      language: 'JavaScript',
    };
  }
  if (project.enabledLibraries.length || project.hiddenUIComponents.length) {
    files['popcode.json'] = {
      content: createPopcodeJson(project),
      language: 'JSON',
    };
  }

  return {
    description: 'Exported from Popcode.',
    'public': true,
    files,
  };
}

async function updateGistWithImportUrl(github, gistData) {
  const gist = github.getGist(gistData.id);
  const uri = document.createElement('a');
  uri.setAttribute('href', '/');
  uri.search = `gist=${gistData.id}`;

  const description = `${gistData.description} Click to import: ${uri.href}`;
  const response =
    await gistPerformWithRetries(() => gist.update({description}));
  return response.data;
}

function createPopcodeJson(project) {
  const json = {};
  if (project.enabledLibraries.length) {
    json.enabledLibraries = project.enabledLibraries;
  }
  if (project.hiddenUIComponents.length) {
    json.hiddenUIComponents = project.hiddenUIComponents;
  }
  return JSON.stringify(json);
}

export async function createFromProject(project, user) {
  const github = gitHub.clientForUser(user);

  const gist = buildGistFromProject(project);
  if (isEmpty(gist.files)) {
    return Promise.reject(new EmptyGistError());
  }

  const response =
    await gistPerformWithRetries(() => github.getGist().create(gist));

  const gistData = response.data;
  if (gitHub.canUpdateGist(user)) {
    return updateGistWithImportUrl(github, gistData);
  }
  return gistData;
}

export async function loadFromId(gistId, user) {
  const github = gitHub.clientForUser(user);
  const gist = github.getGist(gistId);
  const response =
    await gistPerformWithRetries(() => gist.read(), {retries: 3});
  return response.data;
}
