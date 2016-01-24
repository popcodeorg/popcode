var Immutable = require('immutable');

function currentProject(stateIn, action) {
  var state;
  if (stateIn === undefined) {
    state = new Immutable.Map({projectKey: null});
  } else {
    state = stateIn;
  }

  switch (action.type) {
    case 'CURRENT_PROJECT_CHANGED':
      return state.set('projectKey', action.payload.projectKey);
    case 'CURRENT_PROJECT_LOADED_FROM_STORAGE':
      return state.set('projectKey', action.payload.project.projectKey);
    case 'PROJECT_CREATED':
      return state.set('projectKey', action.payload.projectKey);
    default:
      return state;
  }
}

module.exports = currentProject;
