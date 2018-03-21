import {connect} from 'react-redux';
import Instructions from '../components/Instructions';
import {
  getCurrentProjectInstructions,
  getHiddenUIComponents,
} from '../selectors';

function mapStateToProps(state) {
  return {
    instructions: getCurrentProjectInstructions(state),
    isOpen: !getHiddenUIComponents(state).instructions,
  };
}

export default connect(
  mapStateToProps,
)(Instructions);
