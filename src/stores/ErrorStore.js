var _ = require('lodash');

var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
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

function validateSource(projectKey, language) {
  var validate = validations[language];
  var project = ProjectStore.get(projectKey);

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
    case ProjectConstants.PROJECT_SOURCE_UPDATED:
      AppDispatcher.waitFor([ProjectStore.dispatchToken]);
      var projectKey = action.projectKey;
      var language = action.language;
      validateSource(projectKey, language);
      break;
    case ProjectConstants.PROJECT_ADDED:
      AppDispatcher.waitFor([ProjectStore.dispatchToken]);
      var projectKey = action.projectKey;
      validateSource(projectKey, 'html');
      validateSource(projectKey, 'css');
      validateSource(projectKey, 'javascript');
      break;
  }
});

module.exports = ErrorStore;
