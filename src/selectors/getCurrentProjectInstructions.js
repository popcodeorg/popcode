import {createSelector} from 'reselect';
import getCurrentProjectKey from './getCurrentProjectKey';
import getCurrentProjectInstructionsUnsaved
  from './getCurrentProjectInstructionsUnsaved';
import isEditingInstructions from './isEditingInstructions';
import getProjects from './getProjects';

export default createSelector(
  [
    getCurrentProjectKey,
    getProjects,
    isEditingInstructions,
    getCurrentProjectInstructionsUnsaved,
  ],
  (projectKey, projects, isEditing, instructionUnsaved) => {
    if (!projectKey) {
      return '';
    }

    // if you are editing and unsaved instructions exist,
    // show the unsaved instructions
    if (isEditing && instructionUnsaved) {
      return instructionUnsaved;
    }

    // else show the current project saved instructions
    return projects.getIn([projectKey, 'instructions']);
  },
);
