var Storage = require('../services/Storage');

function generateProjectKey() {
  var date = new Date();
  return (date.getTime() * 1000 + date.getMilliseconds()).toString();
}

exports.createProject = function() {
  return function(dispatch) {
    dispatch({
      type: 'PROJECT_CREATED',
      payload: {
        projectKey: generateProjectKey(),
      },
    });
  };
};

exports.loadCurrentProjectFromStorage = function() {
  return function(dispatch) {
    Storage.getCurrentProjectKey().then(function(projectKey) {
      if (projectKey) {
        Storage.load(projectKey).then(function(project) {
          dispatch({
            type: 'CURRENT_PROJECT_LOADED_FROM_STORAGE',
            payload: {project: project},
          });
        });
      } else {
        exports.createProject()(dispatch);
      }
    });
  };
};
