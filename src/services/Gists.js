import GitHub from 'github-api';
import pick from 'lodash/pick';
import Bugsnag from '../util/Bugsnag';
const anonymousGithub = new GitHub({});

function createGistFromProject(project) {
  const files = {};
  if (project.sources.html) {
    files['index.html'] = {
      content: project.sources.html,
      language: 'HTML',
    };
  }
  if (project.sources.css) {
    files['styles.css'] = {
      content: project.sources.css,
      language: 'CSS',
    };
  }
  if (project.sources.javascript) {
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
  }).then(
    (response) => response.data,
    notifyAndRejectApiError
  );
}

function notifyAndRejectApiError(error) {
  if (error.response) {
    Bugsnag.notifyException(
      error,
      'GistError',
      {failedRequest: pick(error, ['request', 'response', 'status'])}
    );
  }

  return Promise.reject(error);
}

const Gists = {
  createFromProject(project, user) {
    const github = clientForUser(user);

    return github.getGist().create(createGistFromProject(project)).
      then((response) => {
        const gistData = response.data;
        if (canUpdateGist(user)) {
          return updateGistWithImportUrl(github, gistData);
        }
        return gistData;
      }, notifyAndRejectApiError);
  },

  loadFromId(gistId, user) {
    const github = clientForUser(user);
    const gist = github.getGist(gistId);
    return gist.read().then(
      (response) => response.data,
      notifyAndRejectApiError
    );
  },
};

export default Gists;
