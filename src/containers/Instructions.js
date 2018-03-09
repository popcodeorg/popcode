import {connect} from 'react-redux';
import Instructions from '../components/Instructions';
import {
  getCurrentProjectInstructions,
  getHiddenUIComponents,
  isEditingInstructions,
} from '../selectors';

function mapStateToProps(state) {
  return {
    instructions: getCurrentProjectInstructions(state),
    isEditing: isEditingInstructions(state),
    isOpen: !getHiddenUIComponents(state).includes('instructions'),
  };
}

export default connect(
  mapStateToProps,
)(Instructions);
