import {connect} from 'react-redux';
import {IdentityConfirmation} from '../components';
import {getCurrentUser} from '../selectors';
import {userAuthenticated} from '../actions/user';

function makeMapStateToProps() {
  return function mapStateToProps(state) {
    return {
      currentUser: getCurrentUser(state),
    };
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onConfirmIdentity(confirmedUser) {
      dispatch(userAuthenticated(confirmedUser));
    },
  };
}

export default connect(
  makeMapStateToProps,
  mapDispatchToProps,
)(IdentityConfirmation);
