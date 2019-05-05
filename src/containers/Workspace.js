import {connect} from 'react-redux';

import Workspace from '../components/Workspace';
import {
  getCurrentProject,
  isDraggingColumnDivider,
  isEditingInstructions,
  getHiddenAndVisibleLanguages,
  getOpenTopBarMenu,
} from '../selectors';
import {
  toggleComponent,
  applicationLoaded,
  startDragColumnDivider,
  stopDragColumnDivider,
  startEditingInstructions,
} from '../actions';
import resizableFlex from '../higherOrderComponents/resizableFlex';

function mapStateToProps(state) {
  const {hiddenLanguages} = getHiddenAndVisibleLanguages(state);
  return {
    currentProject: getCurrentProject(state),
    isAnyTopBarMenuOpen: Boolean(getOpenTopBarMenu(state)),
    isDraggingColumnDivider: isDraggingColumnDivider(state),
    isEditingInstructions: isEditingInstructions(state),
    hiddenLanguages,
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

    onClickInstructionsEditButton(projectKey) {
      dispatch(startEditingInstructions(projectKey));
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(resizableFlex(2)(Workspace));
