var Immutable = require('immutable');

function projects(stateIn, action) {
  var state;

  if (stateIn === undefined) {
    state = new Immutable.Map();
  } else {
    state = stateIn;
  }

  switch (action.type) {
    case 'CURRENT_PROJECT_LOADED_FROM_STORAGE':
      return state.set(
        action.payload.project.projectKey,
        action.payload.project
      );
    case 'PROJECT_SOURCE_EDITED':
      return state.setIn(
        [action.payload.projectKey, 'sources', action.payload.language],
        action.payload.newValue
      );
    default:
      return state;
  }
}

module.exports = projects;
