import {Promise} from 'es6-promise';
import GitHub from 'github-api';
const github = new GitHub({});
const gist = new github.Gist({});

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

const Gists = {
  createFromProject: project => new Promise((resolve, reject) => {
    gist.create(createGistFromProject(project), (error, response) => {
      if (error) {
        reject(error);
      } else {
        resolve(response);
      }
    });
  }),
};

export default Gists;
