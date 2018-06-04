import {connect} from 'react-redux';

import ProjectPreview from '../components/ProjectPreview';
import {changeCurrentProject} from '../actions';
import {
  makeGetProjectPreview,
  getCurrentProjectKey,
  getProject,
} from '../selectors';

function makeMapStateToProps() {
  const getProjectPreview = makeGetProjectPreview();

  return function mapStateToProps(state, {projectKey}) {
    return {
      preview: getProjectPreview(state, {projectKey}),
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
