import isProjectExportInProgress from './isProjectExportInProgress';

export default function isGistExportInProgress(state) {
  return isProjectExportInProgress(state, 'gist');
}
