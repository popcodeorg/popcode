var _ = require('lodash');
var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var ProjectActions = require('../actions/ProjectActions');
var ProjectConstants = require('../constants/ProjectConstants');
var Storage = require('../services/Storage');

var CHANGE_EVENT = 'change';

var _projects = {};

Storage.all().then(function(results) {
  results.forEach(function(result) {
    ProjectActions.add(result.key, result.data);
  });
});

var ProjectStore = _.assign({}, EventEmitter.prototype, {
  get: function(projectKey) {
    return _projects[projectKey];
  },

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }
});

ProjectStore.dispatchToken = AppDispatcher.register(function(action) {
  switch(action.actionType) {
    case ProjectConstants.PROJECT_SOURCE_UPDATED:
      var project = ProjectStore.get(action.projectKey);
      project.sources[action.language] = action.source;
      ProjectStore.emitChange();
      break;

    case ProjectConstants.PROJECT_ADDED:
    case ProjectConstants.PROJECT_CREATED:
      _projects[action.projectKey] = action.project;
      ProjectStore.emitChange();
      break;
  }
});

module.exports = ProjectStore;
