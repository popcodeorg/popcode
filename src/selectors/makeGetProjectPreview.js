import {createSelector} from 'reselect';
import {generateTextPreview} from '../util/generatePreview';

export default function makeGetProjectPreview() {
  return createSelector(
    (state, {projectKey}) => state.getIn(['projects', projectKey]),
    project => generateTextPreview(project.toJS()),
  );
}
