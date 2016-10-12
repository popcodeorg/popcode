import GitHub from 'github-api';
import trim from 'lodash/trim';
import isEmpty from 'lodash/isEmpty';
import promiseRetry from 'promise-retry';
const anonymousGithub = new GitHub({});

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

  return gist.update({
    description: `${gistData.description} Click to import: ${uri.href}`,
  }).then((response) => response.data);
}

const Gists = {
  createFromProject(project, user) {
    const github = clientForUser(user);

    const gist = createGistFromProject(project);
    if (isEmpty(gist.files)) {
      return Promise.reject(new EmptyGistError());
    }

    return github.getGist().create(gist).
      then((response) => {
        const gistData = response.data;
        if (canUpdateGist(user)) {
          return updateGistWithImportUrl(github, gistData);
        }
        return gistData;
      }).then((gistData) => promiseRetry(
        (retry) => this.loadFromId(gistData.id, user).catch(retry),
        {
          retries: 5,
          factor: 2,
          minTimeout: 1000,
          maxTimeout: 10000,
        }
      ));
  },

  loadFromId(gistId, user) {
    const github = clientForUser(user);
    const gist = github.getGist(gistId);
    return gist.read().then((response) => response.data);
  },
};

export default Gists;
