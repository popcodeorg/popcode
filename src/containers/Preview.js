import {connect} from 'react-redux';
import Preview from '../components/Preview';
import {
  addRuntimeError,
  popOutProject,
  refreshPreview,
} from '../actions';
import {
  getCompiledProjects,
  getNewConsoleInputs,
  isCurrentProjectSyntacticallyValid,
  isUserTyping,
} from '../selectors';

function mapStateToProps(state) {
  return {
    compiledProjects: getCompiledProjects(state),
    consoleInputs: getNewConsoleInputs(state),
    showingErrors: (
      !isUserTyping(state) &&
        !isCurrentProjectSyntacticallyValid(state)
    ),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onPopOutProject() {
      dispatch(popOutProject());
    },

    onRuntimeError(error) {
      dispatch(addRuntimeError('javascript', error));
    },

    onRefreshClick() {
      dispatch(refreshPreview(Date.now()));
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Preview);
