var Immutable = require('immutable');

function currentProject(stateIn, action) {
  var state;
  if (stateIn === undefined) {
    state = new Immutable.Map({projectKey: null});
  } else {
    state = stateIn;
  }

  return state.set('projectKey', action.payload.project.projectKey);
}

module.exports = currentProject;
