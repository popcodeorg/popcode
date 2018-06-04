import {connect} from 'react-redux';

import Workspace from '../components/Workspace';
import {getCurrentProject, isEditingInstructions} from '../selectors';
import {
  dragColumnDivider,
  startDragColumnDivider,
  stopDragColumnDivider,
  toggleComponent,
  applicationLoaded,
} from '../actions';

function mapStateToProps(state) {
  return {
    currentProject: getCurrentProject(state),
    isEditingInstructions: isEditingInstructions(state),
    rowsFlex: state.getIn(['ui', 'workspace', 'rowFlex']).toJS(),
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

    onDragColumnDivider(payload) {
      dispatch(dragColumnDivider(payload));
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
)(Workspace);
