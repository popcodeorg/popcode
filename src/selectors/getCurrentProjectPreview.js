import getCurrentProjectKey from './getCurrentProjectKey';
import makeGetProjectPreview from './makeGetProjectPreview';

const getProjectPreview = makeGetProjectPreview();

export default function getCurrentProjectPreview(state) {
  const projectKey = getCurrentProjectKey(state);
  if (projectKey) {
    return getProjectPreview(state, {projectKey});
  }
  return null;
}
