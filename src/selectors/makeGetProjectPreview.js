import {createSelector} from 'reselect';
import {generateTextPreview} from '../util/compileProject';

export default function makeGetProjectPreview() {
  return createSelector(
    (state, {projectKey}) => state.getIn(['projects', projectKey]),
    project => generateTextPreview(project.toJS()),
  );
}
