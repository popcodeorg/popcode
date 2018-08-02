import {connect} from 'react-redux';

import Console from '../components/Console';
import {
  getCurrentCompiledProjectKey,
  getConsoleHistory,
  getCurrentProjectKey,
  getCurrentInputValue,
  getHiddenUIComponents,
  getRequestedFocusedLine,
  isCurrentProjectSyntacticallyValid,
  isTextSizeLarge,
} from '../selectors';
import {
  consoleChange,
  evaluateConsoleEntry,
  toggleComponent,
  focusLine,
  editorFocusedRequestedLine,
  clearConsoleEntries,
  navigateConsoleHistory,
} from '../actions';

function mapStateToProps(state) {
  return {
    currentCompiledProjectKey: getCurrentCompiledProjectKey(state),
    currentProjectKey: getCurrentProjectKey(state),
    history: getConsoleHistory(state),
    currentInputValue: getCurrentInputValue(state),
    isOpen: !getHiddenUIComponents(state).includes('console'),
    isTextSizeLarge: isTextSizeLarge(state),
    requestedFocusedLine: getRequestedFocusedLine(state),
    isHidden: !isCurrentProjectSyntacticallyValid(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onClearConsoleEntries() {
      dispatch(clearConsoleEntries());
    },

    onInput(input) {
      dispatch(evaluateConsoleEntry(input));
    },

    onToggleVisible(projectKey) {
      dispatch(toggleComponent(projectKey, 'console'));
    },

    onConsoleClicked() {
      dispatch(focusLine('console', 0, 0));
    },

    onRequestedLineFocused() {
      dispatch(editorFocusedRequestedLine());
    },

    onNavigateConsoleHistory(direction) {
      dispatch(navigateConsoleHistory(direction));
    },

    onChange(value) {
      dispatch(consoleChange(value));
    },

  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Console);
