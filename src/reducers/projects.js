/* global __dirname */

var Immutable = require('immutable');
var fs = require('fs');
var path = require('path');

var newProject = Immutable.fromJS({
  sources: {
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
  enabledLibraries: new Immutable.Set(),
});

function projects(stateIn, action) {
  var state;

  if (stateIn === undefined) {
    state = new Immutable.Map();
  } else {
    state = stateIn;
  }

  switch (action.type) {
    case 'PROJECT_LOADED_FROM_STORAGE':
      return state.set(
        action.payload.project.projectKey,
        action.payload.project
      );

    case 'PROJECT_SOURCE_EDITED':
      return state.setIn(
        [action.payload.projectKey, 'sources', action.payload.language],
        action.payload.newValue
      );

    case 'PROJECT_CREATED':
      return state.set(
        action.payload.projectKey,
        newProject.set('projectKey', action.payload.projectKey)
      );

    case 'PROJECT_LIBRARY_TOGGLED':
      return state.updateIn(
        [action.payload.projectKey, 'enabledLibraries'],
        function(enabledLibraries) {
          var libraryKey = action.payload.libraryKey;
          if (enabledLibraries.has(libraryKey)) {
            return enabledLibraries.delete(libraryKey);
          }
          return enabledLibraries.add(libraryKey);
        }
      );

    default:
      return state;
  }
}

module.exports = projects;
