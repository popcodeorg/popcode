import {getCurrentProject, getCurrentUserId} from '../../selectors';
import {isPristineProject} from '../../util/projectUtils';
import {saveProject} from '../../clients/firebase';
import {projectSuccessfullySaved} from '../../actions/projects';

export default async function saveCurrentProject(state) {
  const userId = getCurrentUserId(state);
  const currentProject = getCurrentProject(state);
  if (userId && currentProject && !isPristineProject(currentProject)) {
    await saveProject(userId, currentProject);
    return projectSuccessfullySaved();
  }
  return null;
}
