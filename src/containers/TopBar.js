import {connect} from 'react-redux';
import {TopBar} from '../components';
import {
  getCurrentValidationState,
  isUserTyping,
} from '../selectors';
import {} from '../actions';

function mapStateToProps(state) {
  return {
    isUserTyping: isUserTyping(state),
    validationState: getCurrentValidationState(state),
  };
}

function mapDispatchToProps() {
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TopBar);
