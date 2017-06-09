import {connect} from 'react-redux';
import {Preview} from '../components';
import {
  addRuntimeError,
  clearRuntimeErrors,
  popOutProject,
  refreshPreview,
} from '../actions';
import {getCurrentProject} from '../util/projectUtils';

function mapStateToProps(state) {
  return {
    isValid: !state.get('errors').find(
      error => error.get('state') !== 'passed',
    ),
    lastRefreshTimestamp: state.getIn(['ui', 'lastRefreshTimestamp']),
    project: getCurrentProject(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onClearRuntimeErrors() {
      dispatch(clearRuntimeErrors());
    },

    onPopOutProject(project) {
      dispatch(popOutProject(project));
    },

    onRuntimeError(error) {
      dispatch(addRuntimeError(error));
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
