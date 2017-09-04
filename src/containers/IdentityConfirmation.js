import {connect} from 'react-redux';
import {confirmIdentity} from '../actions/user';
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
  };
}

export default connect(
  makeMapStateToProps,
  mapDispatchToProps,
)(IdentityConfirmation);
