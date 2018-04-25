import {connect} from 'react-redux';
import Instructions from '../components/Instructions';
import {
  getCurrentProjectInstructions,
  getCurrentProjectKey,
  getHiddenUIComponents,
  isEditingInstructions,
} from '../selectors';
import {
  cancelEditingInstructions,
  continueEditingInstructions,
  updateProjectInstructions,
} from '../actions';

function mapStateToProps(state) {
  return {
    instructions: getCurrentProjectInstructions(state),
    isEditing: isEditingInstructions(state),
    isOpen: !getHiddenUIComponents(state).includes('instructions'),
    projectKey: getCurrentProjectKey(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onCancelEditing() {
      dispatch(cancelEditingInstructions());
    },
    onContinueEditing(projectKey, newValue) {
      dispatch(continueEditingInstructions(projectKey, newValue));
    },
    onSaveChanges(projectKey, newValue) {
      dispatch(updateProjectInstructions(projectKey, newValue));
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Instructions);
