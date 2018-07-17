import {connect} from 'react-redux';

import Workspace from '../components/Workspace';
import {getCurrentProject, isEditingInstructions} from '../selectors';
import {
  toggleComponent,
  applicationLoaded,
  startDragColumnDivider,
  stopDragColumnDivider,
} from '../actions';
import resizableFlex from '../higherOrderComponents/resizableFlex';

function mapStateToProps(state) {
  return {
    currentProject: getCurrentProject(state),
    isEditingInstructions: isEditingInstructions(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onApplicationLoaded(payload) {
      dispatch(applicationLoaded(payload));
    },

    onComponentToggle(projectKey, componentName) {
      dispatch(toggleComponent(projectKey, componentName));
    },

    onStartDragColumnDivider() {
      dispatch(startDragColumnDivider());
    },

    onStopDragColumnDivider() {
      dispatch(stopDragColumnDivider());
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(resizableFlex(2)(Workspace));
