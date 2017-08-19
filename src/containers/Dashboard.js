import {connect} from 'react-redux';
import {Dashboard} from '../components';
import {
  getCurrentProjectInstructions,
  isDashboardOpen,
} from '../selectors';

function mapStateToProps(state) {
  return {
    instructions: getCurrentProjectInstructions(state),
    isOpen: isDashboardOpen(state),
  };
}

export default connect(
  mapStateToProps,
)(Dashboard);
