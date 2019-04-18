import {getCurrentProject, getCurrentUserId} from '../selectors';
import {isPristineProject} from '../util/projectUtils';
import {saveProject} from '../clients/firebase';
import {projectSuccessfullySaved} from '../actions/projects';

export async function saveCurrentProject(state) {
  const userId = await getCurrentUserId(state);
  const currentProject = await getCurrentProject(state);
  if (userId && currentProject && !isPristineProject(currentProject)) {
    await saveProject(userId, currentProject);
    return projectSuccessfullySaved();
  }
  return null;
}
