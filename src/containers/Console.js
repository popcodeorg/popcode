import {connect} from 'react-redux';
import Console from '../components/Console';
import {
  getCurrentCompiledProjectKey,
  getConsoleHistory,
  getCurrentProjectKey,
  getHiddenUIComponents,
  isExperimental,
  isTextSizeLarge,
} from '../selectors';
import {evaluateConsoleEntry, toggleComponent} from '../actions';

function mapStateToProps(state) {
  return {
    currentCompiledProjectKey: getCurrentCompiledProjectKey(state),
    currentProjectKey: getCurrentProjectKey(state),
    history: getConsoleHistory(state),
    isEnabled: isExperimental(state),
    isOpen: !getHiddenUIComponents(state).includes('console'),
    isTextSizeLarge: isTextSizeLarge(state),
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
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Console);
