import get from 'lodash/get';
import {createSelector} from 'reselect';
import getCurrentProject from './getCurrentProject';

export default createSelector(
  [getCurrentProject],
  currentProject => get(currentProject, 'hiddenUIComponents', []),
);
