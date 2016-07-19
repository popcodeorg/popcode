import {createAction} from 'redux-actions';

const createProjectWithKey = createAction(
  'PROJECT_CREATED',
  (projectKey) => ({projectKey})
);

export function createProject() {
  return (dispatch) => {
    dispatch(createProjectWithKey(generateProjectKey()));
  };
}

function generateProjectKey() {
  const date = new Date();
  return (date.getTime() * 1000 + date.getMilliseconds()).toString();
}
