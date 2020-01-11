import {connect} from 'react-redux';

import {archiveProject, changeCurrentProject} from '../actions';
import ProjectPreview from '../components/ProjectPreview';
import {
  getCurrentProjectKey,
  getProject,
  makeGetProjectPreview,
} from '../selectors';

function makeMapStateToProps() {
  const getProjectPreview = makeGetProjectPreview();

  return function mapStateToProps(state, {projectKey}) {
    return {
      preview: getProjectPreview(state, {projectKey}),
      isCurrentProject: projectKey === getCurrentProjectKey(state),
      project: getProject(state, {projectKey}),
    };
  };
}

function mapDispatchToProps(dispatch, {projectKey}) {
  return {
    onProjectSelected() {
      dispatch(changeCurrentProject(projectKey));
    },
    onProjectArchived() {
      dispatch(archiveProject(projectKey));
    },
  };
}

export default connect(makeMapStateToProps, mapDispatchToProps)(ProjectPreview);
