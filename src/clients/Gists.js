import assign from 'lodash/assign';
import isEmpty from 'lodash/isEmpty';
import get from 'lodash/get';
import trim from 'lodash/trim';
import promiseRetry from 'promise-retry';
import gitHub from '../services/gitHub';

function performWithRetries(perform, options = {}) {
  return promiseRetry(
    retry => perform().catch((error) => {
      if (error.message === 'Network Error') {
        return retry(error);
      }
      return Promise.reject(error);
    }),
    assign({
      retries: 5,
      factor: 2,
      minTimeout: 1000,
      maxTimeout: 10000,
    }, options),
  );
}

export function EmptyGistError(message) {
  this.name = 'EmptyGistError';
  this.message = message;
  this.stack = new Error().stack;
}
EmptyGistError.prototype = Object.create(Error.prototype);

export function createGistFromProject(project) {
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

function clientForUser(user) {
  const githubToken = getGithubToken(user);
  if (githubToken) {
    return gitHub.withAccessToken(githubToken);
  }

  return gitHub.anonymous();
}

function getGithubToken(user) {
  return get(user, ['accessTokens', 'github.com']);
}

function canUpdateGist(user) {
  return Boolean(getGithubToken(user));
}

async function updateGistWithImportUrl(github, gistData) {
  const gist = github.getGist(gistData.id);
  const uri = document.createElement('a');
  uri.setAttribute('href', '/');
  uri.search = `gist=${gistData.id}`;

  const description = `${gistData.description} Click to import: ${uri.href}`;
  const response = await performWithRetries(() => gist.update({description}));
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

const Gists = {
  async createFromProject(project, user) {
    const github = clientForUser(user);

    const gist = createGistFromProject(project);
    if (isEmpty(gist.files)) {
      return Promise.reject(new EmptyGistError());
    }

    const response =
      await performWithRetries(() => github.getGist().create(gist));

    const gistData = response.data;
    if (canUpdateGist(user)) {
      return updateGistWithImportUrl(github, gistData);
    }
    return gistData;
  },

  async loadFromId(gistId, user) {
    const github = clientForUser(user);
    const gist = github.getGist(gistId);
    const response = await performWithRetries(() => gist.read(), {retries: 3});
    return response.data;
  },
};

export default Gists;
