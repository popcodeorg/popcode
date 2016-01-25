var Promise = require('es6-promise').Promise;
var GitHub = require('github-api/github');
var github = new GitHub({});
var gist = new github.Gist({});

function createGistFromProject(project) {
  var files = {};
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
    files: files,
  };
}

var Gists = {
  createFromProject: function(project) {
    return new Promise(function(resolve, reject) {
      gist.create(
        createGistFromProject(project),
        function(error, response) {
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

module.exports = Gists;
