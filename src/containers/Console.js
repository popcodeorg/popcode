import {connect} from 'react-redux';
import Console from '../components/Console';
import {
  getCurrentCompiledProjectKey,
  getConsoleHistory,
  getCurrentProjectKey,
  getHiddenUIComponents,
  makeGetResizableSectionFlex,
  getRequestedFocusedLine,
  isCurrentProjectSyntacticallyValid,
  isTextSizeLarge,
} from '../selectors';
import {
  evaluateConsoleEntry,
  toggleComponent,
  storeResizableSectionRef,
  focusLine,
  editorFocusedRequestedLine,
  clearConsoleEntries,
} from '../actions';

function mapStateToProps(state) {
  const getResizableSectionFlex = makeGetResizableSectionFlex();
  return {
    currentCompiledProjectKey: getCurrentCompiledProjectKey(state),
    currentProjectKey: getCurrentProjectKey(state),
    history: getConsoleHistory(state),
    isOpen: !getHiddenUIComponents(state).includes('console'),
    isTextSizeLarge: isTextSizeLarge(state),
    outputRowFlex: getResizableSectionFlex(state, 'output'),
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

    onRef(ref) {
      dispatch(storeResizableSectionRef('output', 1, ref));
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
