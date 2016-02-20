import {Promise} from 'es6-promise';
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
    description: 'Exported from Popcode',
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

const Gists = {
  createFromProject(project, user) {
    return new Promise((resolve, reject) => {
      const github = clientForUser(user);
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
    });
  },
};

export default Gists;
