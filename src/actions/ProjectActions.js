var AppDispatcher = require('../dispatcher/AppDispatcher');
var ProjectConstants = require('../constants/ProjectConstants');
var defaults = require('../config').defaults;

function generateProjectKey() {
  var date = new Date();
  return (date.getTime() * 1000 + date.getMilliseconds()).toString();
}

var ProjectActions = {
  add: function(projectKey, project) {
    AppDispatcher.dispatch({
      actionType: ProjectConstants.PROJECT_ADDED,
      projectKey: projectKey,
      project: project
    });
  },

  create: function() {
    AppDispatcher.dispatch({
      actionType: ProjectConstants.PROJECT_CREATED,
      projectKey: generateProjectKey(),
      project: defaults
    });
  },

  updateSource: function(projectKey, language, source) {
    AppDispatcher.dispatch({
      actionType: ProjectConstants.PROJECT_SOURCE_EDITED,
      projectKey: projectKey,
      language: language,
      source: source
    });
  }
};

module.exports = ProjectActions;
