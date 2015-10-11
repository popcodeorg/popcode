var AppDispatcher = require('../dispatcher/AppDispatcher');
var ProjectConstants = require('../constants/ProjectConstants');
var defaults = require('../config').defaults;

var ProjectActions = {
  create: function() {
    AppDispatcher.dispatch({
      actionType: ProjectConstants.PROJECT_CREATED,
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
  },

  toggleLibrary: function(projectKey, libraryKey) {
    AppDispatcher.dispatch({
      actionType: ProjectConstants.PROJECT_LIBRARY_TOGGLED,
      projectKey: projectKey,
      libraryKey: libraryKey
    });
  },

  loadFromStorage: function(project) {
    AppDispatcher.dispatch({
      actionType: ProjectConstants.PROJECT_LOADED_FROM_STORAGE,
      projectKey: project.projectKey,
      project: project
    });
  }
};

module.exports = ProjectActions;
