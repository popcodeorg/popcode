var Immutable = require('immutable');

function projects(stateIn, action) {
  var state;

  if (stateIn === undefined) {
    state = new Immutable.Map();
  } else {
    state = stateIn;
  }

  return state.set(action.payload.project.projectKey, action.payload.project);
}

module.exports = projects;
