import Immutable from 'immutable';

const noCurrentProject = new Immutable.Map({projectKey: null});

function currentProject(stateIn, action) {
  let state;
  if (stateIn === undefined) {
    state = noCurrentProject;
  } else {
    state = stateIn;
  }

  switch (action.type) {
    case 'CURRENT_PROJECT_CHANGED':
      return state.set('projectKey', action.payload.projectKey);
    case 'PROJECT_CREATED':
      return state.set('projectKey', action.payload.projectKey);
    default:
      return state;
  }
}

export default currentProject;
