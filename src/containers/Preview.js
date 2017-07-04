import {connect} from 'react-redux';
import {Preview} from '../components';
import {
  addRuntimeError,
  popOutProject,
  refreshPreview,
} from '../actions';
import {getCurrentProject} from '../util/projectUtils';

const syntacticallyValidStates = new Set(['passed', 'runtime-error']);

function mapStateToProps(state) {
  return {
    isSyntacticallyValid: !state.get('errors').find(
      error => !syntacticallyValidStates.has(error.get('state')),
    ),
    lastRefreshTimestamp: state.getIn(['ui', 'lastRefreshTimestamp']),
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
