import {connect} from 'react-redux';

import Preview from '../components/Preview';
import {
  addRuntimeError,
  consoleErrorProduced,
  consoleLogProduced,
  consoleValueProduced,
  popOutProject,
  refreshPreview,
  testProduced,
  testAssertionProduced,
} from '../actions';
import {
  getCompiledProjects,
  getConsoleHistory,
  getCurrentProjectTests,
  getShouldRunTests,
  isCurrentProjectSyntacticallyValid,
  isUserTyping,
} from '../selectors';

function mapStateToProps(state) {
  return {
    compiledProjects: getCompiledProjects(state),
    consoleEntries: getConsoleHistory(state),
    showingErrors: (
      !isUserTyping(state) &&
        !isCurrentProjectSyntacticallyValid(state)
    ),
    shouldRunTests: getShouldRunTests(state),
    tests: getCurrentProjectTests(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onConsoleError(key, name, message, compiledProjectKey) {
      dispatch(consoleErrorProduced(key, name, message, compiledProjectKey));
    },

    onConsoleValue(key, value, compiledProjectKey) {
      dispatch(consoleValueProduced(key, value, compiledProjectKey));
    },

    onConsoleLog(value, compiledProjectKey) {
      dispatch(consoleLogProduced(value, compiledProjectKey));
    },

    onPopOutProject() {
      dispatch(popOutProject());
    },

    onRefreshClick() {
      dispatch(refreshPreview(Date.now()));
    },

    onRuntimeError(error) {
      dispatch(addRuntimeError('javascript', error));
    },

    onTestProduced(params) {
      dispatch(testProduced(params));
    },

    onTestAssertionProduced(params) {
      dispatch(testAssertionProduced(params));
    },

  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Preview);
