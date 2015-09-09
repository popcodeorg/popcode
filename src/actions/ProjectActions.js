var AppDispatcher = require('../dispatcher/AppDispatcher');
var ProjectConstants = require('../constants/ProjectConstants');

var ProjectActions = {
  add: function(projectKey, project) {
    AppDispatcher.dispatch({
      actionType: ProjectConstants.PROJECT_ADDED,
      projectKey: projectKey,
      project: project
    });
  },

  updateSource: function(projectKey, language, source) {
    AppDispatcher.dispatch({
      actionType: ProjectConstants.PROJECT_SOURCE_UPDATED,
      projectKey: projectKey,
      language: language,
      source: source
    });
  }
};

module.exports = ProjectActions;
