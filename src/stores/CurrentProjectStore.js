var _ = require('lodash');
var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;

var CurrentProjectConstants = require('../constants/CurrentProjectConstants');
var CurrentProjectActions = require('../actions/CurrentProjectActions');
var ProjectConstants = require('../constants/ProjectConstants');
var ProjectActions = require('../actions/ProjectActions');
var Storage = require ('../services/Storage');

var CHANGE_EVENT = 'change';

Storage.getCurrentProjectKey().then(function(projectKey) {
  if (projectKey) {
    CurrentProjectActions.setKeyFromStorage(projectKey);
  } else {
    ProjectActions.create();
  }
});

var _currentProjectKey;

var CurrentProjectStore = _.assign({}, EventEmitter.prototype, {
  getKey: function() {
    return _currentProjectKey;
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

CurrentProjectStore.dispatchToken = AppDispatcher.register(function(action) {
  switch(action.actionType) {
    case CurrentProjectConstants.CURRENT_PROJECT_KEY_LOADED:
    case CurrentProjectConstants.CURRENT_PROJECT_KEY_CHANGED:
      _currentProjectKey = action.projectKey;
      CurrentProjectStore.emit(CHANGE_EVENT);
      break;

    case ProjectConstants.PROJECT_CREATED:
      _currentProjectKey = action.projectKey;
      Storage.setCurrentProjectKey(action.projectKey);
      CurrentProjectStore.emit(CHANGE_EVENT);
      break;
  }
});

module.exports = CurrentProjectStore;
