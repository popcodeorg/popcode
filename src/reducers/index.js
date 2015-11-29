var combineReducers = require('redux').combineReducers;
var projects = require('./projects');
var currentProject = require('./currentProject');
var errors = require('./errors');

var reducers = combineReducers({
  projects: projects,
  currentProject: currentProject,
  errors: errors,
});

module.exports = reducers;
