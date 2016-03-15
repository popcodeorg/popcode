import GitHub from 'github-api';
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

  return new Promise((resolve, reject) => {
    gist.update(
      {description: `${gistData.description} Click to import: ${uri.href}`},
      (err, updatedGistData) => {
        if (err) {
          reject(err);
        } else {
          resolve(updatedGistData);
        }
      }
    );
  });
}

const Gists = {
  createFromProject(project, user) {
    const github = clientForUser(user);

    return new Promise((resolve, reject) => {
      new github.Gist({}).create(
        createGistFromProject(project),
        (error, response) => {
          if (error) {
            reject(error);
          } else {
            resolve(response);
          }
        }
      );
    }).then((response) => {
      if (canUpdateGist(user)) {
        return updateGistWithImportUrl(github, response);
      }
      return response;
    });
  },

  loadFromId(gistId, user) {
    return new Promise((resolve, reject) => {
      const github = clientForUser(user);
      const gist = github.getGist(gistId);
      gist.read((err, gistData) => {
        if (err) {
          reject(err);
        } else {
          resolve(gistData);
        }
      });
    });
  },
};

export default Gists;
