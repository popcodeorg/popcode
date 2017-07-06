import {connect} from 'react-redux';
import {Preview} from '../components';
import {
  addRuntimeError,
  popOutProject,
  refreshPreview,
} from '../actions';
import {
  getCurrentProject,
  getLastRefreshTimestamp,
  isCurrentProjectSyntacticallyValid,
} from '../selectors';

function mapStateToProps(state) {
  return {
    isSyntacticallyValid: isCurrentProjectSyntacticallyValid(state),
    lastRefreshTimestamp: getLastRefreshTimestamp(state),
    project: getCurrentProject(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onPopOutProject(project) {
      dispatch(popOutProject(project));
    },

    onRuntimeError(language, error) {
      dispatch(addRuntimeError(language, error));
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
