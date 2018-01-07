import {connect} from 'react-redux';
import Console from '../components/Console';
import {
  getCurrentCompiledProjectKey,
  getConsoleHistory,
  getCurrentProjectKey,
  getHiddenUIComponents,
  getRequestedFocusedLine,
  isCurrentProjectSyntacticallyValid,
  isTextSizeLarge,
} from '../selectors';
import {
  evaluateConsoleEntry,
  toggleComponent,
  focusLine,
  editorFocusedRequestedLine,
  clearConsoleEntries,
} from '../actions';

function mapStateToProps(state) {
  return {
    currentCompiledProjectKey: getCurrentCompiledProjectKey(state),
    currentProjectKey: getCurrentProjectKey(state),
    history: getConsoleHistory(state),
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

  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Console);
