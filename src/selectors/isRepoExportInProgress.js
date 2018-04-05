import isProjectExportInProgress from './isProjectExportInProgress';

export default function isRepoExportInProgress(state) {
  return isProjectExportInProgress(state, 'repo');
}
