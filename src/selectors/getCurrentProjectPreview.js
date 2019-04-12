import makeGetProjectPreview from './makeGetProjectPreview';
import getCurrentProjectKey from './getCurrentProjectKey';

const getProjectPreview = makeGetProjectPreview();

export default function getCurrentProjectPreview(state) {
  const projectKey = getCurrentProjectKey(state);
  if (projectKey) {
    return getProjectPreview(state, {projectKey});
  }
  return null;
}
