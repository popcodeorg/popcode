import {connect} from 'react-redux';
import Preview from '../components/Preview';
import {
  addRuntimeError,
  popOutProject,
  refreshPreview,
} from '../actions';
import {
  getCompiledProjects,
  getLastRefreshTimestamp,
  isCurrentProjectSyntacticallyValid,
} from '../selectors';

function mapStateToProps(state) {
  return {
    isSyntacticallyValid: isCurrentProjectSyntacticallyValid(state),
    lastRefreshTimestamp: getLastRefreshTimestamp(state),
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
