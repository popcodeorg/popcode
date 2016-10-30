import GitHub from 'github-api';
import trim from 'lodash/trim';
import isEmpty from 'lodash/isEmpty';
import promiseRetry from 'promise-retry';
const anonymousGithub = new GitHub({});

function performWithRetries(perform, options = {}) {
  return promiseRetry(
    (retry) => perform().catch((error) => {
      if (error.message === 'Network Error') {
        return retry(error);
      }
      return Promise.reject(error);
    }),
    Object.assign({
      retries: 5,
      factor: 2,
      minTimeout: 1000,
      maxTimeout: 10000,
    }, options)
  );
}

export function EmptyGistError(message) {
  this.name = 'EmptyGistError';
  this.message = message;
  this.stack = new Error().stack;
}
EmptyGistError.prototype = Object.create(Error.prototype);

function createGistFromProject(project) {
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
  if (project.enabledLibraries.length) {
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
  if (user.authenticated && user.provider === 'github') {
    return new GitHub({
      token: user.info.accessToken,
      auth: 'oauth',
    });
  }

  return anonymousGithub;
}

function canUpdateGist(user) {
  return user.authenticated && user.provider === 'github';
}

function updateGistWithImportUrl(github, gistData) {
  const gist = github.getGist(gistData.id);
  const uri = document.createElement('a');
  uri.setAttribute('href', '/');
  uri.search = `gist=${gistData.id}`;

  const description = `${gistData.description} Click to import: ${uri.href}`;
  return performWithRetries(() => gist.update({description})).
    then((response) => response.data);
}

function createPopcodeJson(project) {
  const json = {
    enabledLibraries: project.enabledLibraries,
  };
  return JSON.stringify(json);
}

const Gists = {
  createFromProject(project, user) {
    const github = clientForUser(user);

    const gist = createGistFromProject(project);
    if (isEmpty(gist.files)) {
      return Promise.reject(new EmptyGistError());
    }

    return performWithRetries(() => github.getGist().create(gist)).
      then((response) => {
        const gistData = response.data;
        if (canUpdateGist(user)) {
          return updateGistWithImportUrl(github, gistData);
        }
        return gistData;
      });
  },

  loadFromId(gistId, user) {
    const github = clientForUser(user);
    const gist = github.getGist(gistId);
    return performWithRetries(() => gist.read(), {retries: 3}).
      then((response) => response.data);
  },
};

export default Gists;
