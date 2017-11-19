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
    onConsoleError(key, name, message) {
      dispatch(consoleErrorProduced(key, name, message));
    },

    onConsoleValue(key, value) {
      dispatch(consoleValueProduced(key, value));
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
