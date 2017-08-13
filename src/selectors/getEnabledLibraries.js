import {createSelector} from 'reselect';
import get from 'lodash/get';
import getCurrentProject from './getCurrentProject';

export default createSelector(
  [getCurrentProject],
  currentProject => get(currentProject, ['enabledLibraries'], []),
);
