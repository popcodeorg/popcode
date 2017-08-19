import {connect} from 'react-redux';
import {Instructions} from '../components';
import {
  getCurrentProjectInstructions,
  getHiddenUIComponents,
} from '../selectors';

function mapStateToProps(state) {
  return {
    instructions: getCurrentProjectInstructions(state),
    isOpen: !getHiddenUIComponents(state).includes('instructions'),
  };
}

export default connect(
  mapStateToProps,
)(Instructions);
