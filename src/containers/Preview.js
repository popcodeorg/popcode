import {connect} from 'react-redux';
import Preview from '../components/Preview';
import {
  addRuntimeError,
  consoleErrorProduced,
  consoleValueProduced,
  popOutProject,
  refreshPreview,
} from '../actions';
import {
  getCompiledProjects,
  getConsoleHistory,
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
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onConsoleError(key, name, message, projectKey) {
      dispatch(consoleErrorProduced(key, name, message, projectKey));
    },

    onConsoleValue(key, value, projectKey) {
      dispatch(consoleValueProduced(key, value, projectKey));
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
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Preview);
