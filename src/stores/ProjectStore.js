var lodash = require('lodash');
var fs = require('fs');
var path = require('path');

var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var ProjectActions = require('../actions/ProjectActions');
var ProjectConstants = require('../constants/ProjectConstants');
var Storage = require('../services/Storage');

var CHANGE_EVENT = 'change';

var _projects = {};
var _lastCreatedProjectKey;

function generateProjectKey() {
  var date = new Date();
  return (date.getTime() * 1000 + date.getMilliseconds()).toString();
}

function createNewProject() {
  return {
    projectKey: generateProjectKey(),
    sources: {
      /*global __dirname*/
      html: fs.readFileSync(path.join(
        __dirname,
        '..',
        '..',
        'templates',
        'new.html'
      ), 'utf8'),
      css: '',
      javascript: '',
    },
    enabledLibraries: [],
  };
}

Storage.all().then(function(results) {
  results.forEach(ProjectActions.loadFromStorage);
});

var ProjectStore = lodash.assign({}, EventEmitter.prototype, {
  get: function(projectKey) {
    return _projects[projectKey];
  },

  getLastCreated: function() {
    return this.get(_lastCreatedProjectKey);
  },

  all: function() {
    return lodash.values(_projects);
  },

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },
});

ProjectStore.dispatchToken = AppDispatcher.register(function(action) {
  var project;

  switch (action.actionType) {
    case ProjectConstants.PROJECT_CREATED:
      project = createNewProject();
      _lastCreatedProjectKey = project.projectKey;
      _projects[project.projectKey] = project;
      Storage.save(project);
      ProjectStore.emitChange();
      break;

    case ProjectConstants.PROJECT_SOURCE_EDITED:
      project = ProjectStore.get(action.projectKey);
      project.sources[action.language] = action.source;
      Storage.save(project);
      ProjectStore.emitChange();
      break;

    case ProjectConstants.PROJECT_LOADED_FROM_STORAGE:
      _projects[action.project.projectKey] = action.project;
      ProjectStore.emitChange();
      break;

    case ProjectConstants.PROJECT_LIBRARY_TOGGLED:
      project = ProjectStore.get(action.projectKey);
      var libraries = project.enabledLibraries;
      var libraryKey = action.libraryKey;
      if (libraries.indexOf(libraryKey) === -1) {
        libraries.push(libraryKey);
      } else {
        lodash.pull(libraries, libraryKey);
      }
      Storage.save(action.projectKey, project);
      ProjectStore.emitChange();
      break;
  }
});

module.exports = ProjectStore;
