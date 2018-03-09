import {connect} from 'react-redux';
import Instructions from '../components/Instructions';
import {
  getCurrentProjectInstructions,
  getHiddenUIComponents,
  isEditingInstructions,
} from '../selectors';
import {stopEditingInstructions} from '../actions';

function mapStateToProps(state) {
  return {
    instructions: getCurrentProjectInstructions(state),
    isEditing: isEditingInstructions(state),
    isOpen: !getHiddenUIComponents(state).includes('instructions'),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onCancelEditing() {
      dispatch(stopEditingInstructions());
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Instructions);
