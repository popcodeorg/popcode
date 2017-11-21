import {connect} from 'react-redux';
import Preview from '../components/Preview';
import {
  addRuntimeError,
  popOutProject,
  refreshPreview,
} from '../actions';
import {
  getCompiledProjects,
  isCurrentProjectSyntacticallyValid,
  isUserTyping,
} from '../selectors';

function mapStateToProps(state) {
  return {
    showingErrors: (
      !isUserTyping(state) &&
        !isCurrentProjectSyntacticallyValid(state)
    ),
    compiledProjects: getCompiledProjects(state),
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
