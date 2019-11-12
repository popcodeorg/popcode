import {connect} from 'react-redux';

import Console from '../components/Console';
import {
  getCurrentCompiledProjectKey,
  getConsoleHistory,
  getCurrentProjectKey,
  getCurrentConsoleInputValue,
  getHiddenUIComponents,
  getRequestedFocusedLine,
  isCurrentProjectSyntacticallyValid,
  isTextSizeLarge,
} from '../selectors';
import {
  clearConsoleEntries,
  consoleInputChanged,
  editorFocusedRequestedLine,
  evaluateConsoleEntry,
  focusLine,
  nextConsoleHistory,
  previousConsoleHistory,
  toggleComponent,
} from '../actions';

function mapStateToProps(state) {
  return {
    currentCompiledProjectKey: getCurrentCompiledProjectKey(state),
    currentProjectKey: getCurrentProjectKey(state),
    history: getConsoleHistory(state),
    currentInputValue: getCurrentConsoleInputValue(state),
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

    onPreviousConsoleHistory() {
      dispatch(previousConsoleHistory());
    },

    onNextConsoleHistory() {
      dispatch(nextConsoleHistory());
    },

    onChange(value) {
      dispatch(consoleInputChanged(value));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Console);
