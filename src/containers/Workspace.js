import {connect} from 'react-redux';
import every from 'lodash-es/every';

import Workspace from '../components/Workspace';
import {
  getCurrentProject,
  isDraggingColumnDivider,
  isEditingInstructions,
  getCurrentProjectPreviewTitle,
  getHiddenAndVisibleLanguages,
  getHiddenUIComponents,
  getOpenTopBarMenu,
  isCurrentProjectSyntacticallyValid,
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
  const isCurrentProjectValid = isCurrentProjectSyntacticallyValid(state);
  const hiddenUIComponents = getHiddenUIComponents(state);
  const areAllRightColumnComponentsCollapsed = every(
    ['console', 'preview'],
    component => hiddenUIComponents.includes(component),
  );
  return {
    currentProject: getCurrentProject(state),
    isAnyTopBarMenuOpen: Boolean(getOpenTopBarMenu(state)),
    isDraggingColumnDivider: isDraggingColumnDivider(state),
    isEditingInstructions: isEditingInstructions(state),
    hiddenLanguages,
    shouldShowCollapsedConsole: isCurrentProjectValid,
    shouldRenderOutput: !isCurrentProjectValid ||
      !areAllRightColumnComponentsCollapsed,
    title: getCurrentProjectPreviewTitle(state),
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
