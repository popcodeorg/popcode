import every from 'lodash-es/every';
import {connect} from 'react-redux';

import {
  startDragColumnDivider,
  startEditingInstructions,
  stopDragColumnDivider,
  toggleComponent,
} from '../actions';
import Workspace from '../components/Workspace';
import resizableFlex from '../higherOrderComponents/resizableFlex';
import {
  getCurrentProject,
  getCurrentProjectPreviewTitle,
  getHiddenAndVisibleLanguages,
  getHiddenUIComponents,
  getOpenTopBarMenu,
  isCurrentlyValidating,
  isCurrentProjectSyntacticallyValid,
  isDraggingColumnDivider,
  isEditingInstructions,
  isUserTyping,
} from '../selectors';
import {RIGHT_COLUMN_COMPONENTS} from '../util/ui';

function mapStateToProps(state) {
  const {hiddenLanguages} = getHiddenAndVisibleLanguages(state);
  const isCurrentProjectValid = isCurrentProjectSyntacticallyValid(state);
  const isCurrentProjectValidating = isCurrentlyValidating(state);
  const hiddenUIComponents = getHiddenUIComponents(state);
  const areAllRightColumnComponentsCollapsed = every(
    RIGHT_COLUMN_COMPONENTS,
    component => hiddenUIComponents.includes(component),
  );
  const shouldRenderOutput =
    !areAllRightColumnComponentsCollapsed ||
    (!isCurrentProjectValid &&
      !isCurrentProjectValidating &&
      !isUserTyping(state));
  return {
    currentProject: getCurrentProject(state),
    hasErrors: !isCurrentProjectValid,
    isAnyTopBarMenuOpen: Boolean(getOpenTopBarMenu(state)),
    isDraggingColumnDivider: isDraggingColumnDivider(state),
    isEditingInstructions: isEditingInstructions(state),
    hiddenLanguages,
    shouldRenderOutput,
    title: getCurrentProjectPreviewTitle(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
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
