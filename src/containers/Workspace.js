import {connect} from 'react-redux';
import every from 'lodash-es/every';

import Workspace from '../components/Workspace';
import {
  getCurrentProject,
  isCurrentlyValidating,
  isDraggingColumnDivider,
  isEditingInstructions,
  getCurrentProjectPreviewTitle,
  getHiddenAndVisibleLanguages,
  getHiddenUIComponents,
  getOpenTopBarMenu,
  isCurrentProjectSyntacticallyValid,
  isUserTyping,
} from '../selectors';
import {
  toggleComponent,
  applicationLoaded,
  startDragColumnDivider,
  stopDragColumnDivider,
  startEditingInstructions,
} from '../actions';
import resizableFlex from '../higherOrderComponents/resizableFlex';
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
