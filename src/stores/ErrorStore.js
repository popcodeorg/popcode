var _ = require('lodash');

var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var CurrentProjectConstants = require('../constants/CurrentProjectConstants');
var CurrentProjectStore = require('../stores/CurrentProjectStore');
var ProjectConstants = require('../constants/ProjectConstants');
var ProjectStore = require('../stores/ProjectStore');
var validations = require('../validations');

var CHANGE_EVENT = 'change';

_errors = {};

function emptyErrors() {
  return {html: [], css: [], javascript: []};
}

function setErrors(projectKey, language, errors) {
  if (!_errors.hasOwnProperty(projectKey)) {
    _errors[projectKey] = emptyErrors();
  }

  _errors[projectKey][language] = errors;
}

function validateAllSources(projectKey) {
  validateSource(projectKey, 'html');
  validateSource(projectKey, 'css');
  validateSource(projectKey, 'javascript');
}

function validateSource(projectKey, language) {
  var validate = validations[language];
  var project = ProjectStore.get(projectKey);

  if (!project) {
    return;
  }

  validate(
    project.sources[language],
    project.enabledLibraries
  ).then(function(errors) {
    setErrors(projectKey, language, errors);
    ErrorStore.emitChange();
  }.bind(this));
}

var ErrorStore = _.assign({}, EventEmitter.prototype, {
  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  getErrors: function(projectKey) {
    if (!_errors.hasOwnProperty(projectKey)) {
      return emptyErrors();
    }

    return _errors[projectKey];
  },

  anyErrors: function(projectKey) {
    return _.some(this.getErrors(projectKey), function(errors) {
      return errors.length > 0;
    });
  }
});

ErrorStore.dispatchToken = AppDispatcher.register(function(action) {
  switch(action.actionType) {
    case ProjectConstants.PROJECT_SOURCE_EDITED:
      AppDispatcher.waitFor([ProjectStore.dispatchToken]);
      var projectKey = action.projectKey;
      var language = action.language;
      validateSource(projectKey, language);
      break;
    case ProjectConstants.PROJECT_LIBRARY_TOGGLED:
      AppDispatcher.waitFor([ProjectStore.dispatchToken]);
      validateAllSources(action.projectKey);
      break;
    case ProjectConstants.PROJECT_LOADED_FROM_STORAGE:
      AppDispatcher.waitFor([
        ProjectStore.dispatchToken,
        CurrentProjectStore.dispatchToken
      ]);
      if (CurrentProjectStore.isCurrentProject(action.project)) {
        validateAllSources(action.project.projectKey);
      }
      break;
    case CurrentProjectConstants.CURRENT_PROJECT_KEY_LOADED:
    case CurrentProjectConstants.CURRENT_PROJECT_KEY_CHANGED:
      AppDispatcher.waitFor([ProjectStore.dispatchToken]);
      validateAllSources(action.projectKey);
      break;
  }
});

module.exports = ErrorStore;
