import {connect} from 'react-redux';
import Console from '../components/Console';
import {
  getCurrentCompiledProjectKey,
  getConsoleHistory,
  getCurrentProjectKey,
  getHiddenUIComponents,
  isExperimental,
  isTextSizeLarge,
  getOutputColumnFlex,
} from '../selectors';
import {
  evaluateConsoleEntry,
  toggleComponent,
  storeOutputRowRef,
} from '../actions';

function mapStateToProps(state) {
  return {
    currentCompiledProjectKey: getCurrentCompiledProjectKey(state),
    currentProjectKey: getCurrentProjectKey(state),
    history: getConsoleHistory(state),
    isEnabled: isExperimental(state),
    isOpen: !getHiddenUIComponents(state).includes('console'),
    isTextSizeLarge: isTextSizeLarge(state),
    outputColumnFlex: getOutputColumnFlex(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onInput(input) {
      dispatch(evaluateConsoleEntry(input));
    },

    onToggleVisible(projectKey) {
      dispatch(toggleComponent(projectKey, 'console'));
    },

    onRef(ref) {
      dispatch(storeOutputRowRef(1, ref));
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Console);
