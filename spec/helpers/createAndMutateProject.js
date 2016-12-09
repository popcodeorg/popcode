import {getCurrentProject} from '../../src/util/projectUtils';

import {
  createProject,
  toggleLibrary,
} from '../../src/actions';

export default function createAndMutateProject(store) {
  store.dispatch(createProject());
  const projectKey = getCurrentProject(store.getState()).projectKey;
  store.dispatch(toggleLibrary(projectKey, 'jquery'));
  return projectKey;
}

