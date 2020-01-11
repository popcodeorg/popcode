import {connect} from 'react-redux';

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
import Console from '../components/Console';
import {
  getConsoleHistory,
  getCurrentCompiledProjectKey,
  getCurrentConsoleInputValue,
  getCurrentProjectKey,
  getHiddenUIComponents,
  getRequestedFocusedLine,
  isCurrentProjectSyntacticallyValid,
  isExperimental,
  isTextSizeLarge,
} from '../selectors';

function mapStateToProps(state) {
  return {
    currentCompiledProjectKey: getCurrentCompiledProjectKey(state),
    currentProjectKey: getCurrentProjectKey(state),
    history: getConsoleHistory(state),
    currentInputValue: getCurrentConsoleInputValue(state),
    isExperimental: isExperimental(state),
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
