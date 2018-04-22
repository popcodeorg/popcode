import {createSelector} from 'reselect';
import getCurrentProjectKey from './getCurrentProjectKey';
import getCurrentProjectInstructionsUnsaved
  from './getCurrentProjectInstructionsUnsaved';
import isEditingInstructions from './isEditingInstructions';
import getProjects from './getProjects';

export default createSelector(
  [
    getCurrentProjectKey, getProjects,
    isEditingInstructions, getCurrentProjectInstructionsUnsaved,
  ],
  (projectKey, projects, isEditing, instructionUnsaved) => {
    if (!projectKey) {
      return '';
    }

    if (isEditing && instructionUnsaved) {
      return instructionUnsaved;
    }

    return projectKey ? projects.getIn([projectKey, 'instructions']) : '';
  },
);
