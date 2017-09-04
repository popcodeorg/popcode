import {connect} from 'react-redux';
import {confirmIdentity, rejectIdentity} from '../actions/user';
import IdentityConfirmation from '../components/IdentityConfirmation';
import {getCurrentUser} from '../selectors';

function makeMapStateToProps() {
  return function mapStateToProps(state) {
    return {
      currentUser: getCurrentUser(state),
    };
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onConfirmIdentity() {
      dispatch(confirmIdentity());
    },

    onRejectIdentity() {
      dispatch(rejectIdentity());
    },
  };
}

export default connect(
  makeMapStateToProps,
  mapDispatchToProps,
)(IdentityConfirmation);
