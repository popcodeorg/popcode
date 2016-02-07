var combineReducers = require('redux').combineReducers;
var projects = require('./projects');
var currentProject = require('./currentProject');
var errors = require('./errors');
var runtimeErrors = require('./runtimeErrors');
var delayErrorDisplay = require('./delayErrorDisplay');

var reducers = combineReducers({
  projects: projects,
  currentProject: currentProject,
  errors: errors,
  runtimeErrors: runtimeErrors,
  delayErrorDisplay: delayErrorDisplay,
});

module.exports = reducers;
