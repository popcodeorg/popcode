import {createAction} from 'redux-actions';
import {validateAllSources, getCurrentProject, saveCurrentProject} from '.';

const createProjectWithKey = createAction(
  'PROJECT_CREATED',
  (projectKey) => ({projectKey})
);

export function createProject() {
  return (dispatch) => {
    dispatch(createProjectWithKey(generateProjectKey()));
  };
}

export function changeCurrentProject(projectKey) {
  return (dispatch, getState) => {
    dispatch({
      type: 'CURRENT_PROJECT_CHANGED',
      payload: {projectKey},
    });

    const state = getState();
    saveCurrentProject(state);
    dispatch(validateAllSources(getCurrentProject(state)));
  };
}

function generateProjectKey() {
  const date = new Date();
  return (date.getTime() * 1000 + date.getMilliseconds()).toString();
}
