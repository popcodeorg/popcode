import {connect} from 'react-redux';
import {Dashboard} from '../components';
import {
  exportGist,
  exportRepo,
} from '../actions';
import {
  getCurrentProjectInstructions,
  getCurrentUser,
  isDashboardOpen,
  isExperimental,
  isGistExportInProgress,
} from '../selectors';

function mapStateToProps(state) {
  return {
    currentUser: getCurrentUser(state),
    gistExportInProgress: isGistExportInProgress(state),
    instructions: getCurrentProjectInstructions(state),
    isExperimental: isExperimental(state),
    isOpen: isDashboardOpen(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onExportGist() {
      dispatch(exportGist());
    },

    onExportRepo() {
      dispatch(exportRepo());
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Dashboard);
