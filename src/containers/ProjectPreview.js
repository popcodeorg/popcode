import {connect} from 'react-redux';

import ProjectPreview from '../components/ProjectPreview';
import {changeCurrentProject} from '../actions';
import {
  getCurrentProjectKey,
  getCurrentProjectPreview,
  getProject,
} from '../selectors';

function makeMapStateToProps() {
  return function mapStateToProps(state, {projectKey}) {
    return {
      preview: getCurrentProjectPreview(state),
      isSelected: projectKey === getCurrentProjectKey(state),
      project: getProject(state, {projectKey}),
    };
  };
}

function mapDispatchToProps(dispatch, {projectKey}) {
  return {
    onProjectSelected() {
      dispatch(changeCurrentProject(projectKey));
    },
  };
}

export default connect(
  makeMapStateToProps,
  mapDispatchToProps,
)(ProjectPreview);
