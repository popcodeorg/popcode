import {connect} from 'react-redux';
import Preview from '../components/Preview';
import {
  addRuntimeError,
  consoleErrorProduced,
  consoleLogProduced,
  consoleValueProduced,
  popOutProject,
  refreshPreview,
  storeResizableSectionRef,
} from '../actions';
import {
  getCompiledProjects,
  getConsoleHistory,
  isCurrentProjectSyntacticallyValid,
  isUserTyping,
  getResizableSectionFlex,
  getHiddenUIComponents,
} from '../selectors';

function mapStateToProps(state) {
  return {
    compiledProjects: getCompiledProjects(state),
    consoleEntries: getConsoleHistory(state),
    showingErrors: (
      !isUserTyping(state) &&
        !isCurrentProjectSyntacticallyValid(state)
    ),
    outputRowFlex: getResizableSectionFlex(state, 'output'),
    isConsoleOpen: !getHiddenUIComponents(state).includes('console'),
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

    onRef(ref) {
      dispatch(storeResizableSectionRef('output', 0, ref));
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Preview);
