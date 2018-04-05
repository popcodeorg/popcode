import isProjectExportInProgress from './isProjectExportInProgress';

export default function isClassroomExportInProgress(state) {
  return isProjectExportInProgress(state, 'classroom');
}
