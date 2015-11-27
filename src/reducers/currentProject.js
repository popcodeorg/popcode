var Immutable = require('immutable');

var currentProject = function(state, action) {
  if (state === undefined) {
    state = Immutable.Map({projectKey: null});
  }

  return state.set('projectKey', action.payload.project.projectKey);
};

module.exports = currentProject;
