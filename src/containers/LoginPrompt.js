import {connect} from 'react-redux';

import LoginPrompt from '../components/LoginPrompt';
import {closeLoginPrompt, logIn} from '../actions';
import {isLoginPromptOpen} from '../selectors';

function mapStateToProps(state) {
  return {
    isLoginPromptOpen: isLoginPromptOpen(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onDismiss() {
      dispatch(closeLoginPrompt());
    },

    onLogin() {
      dispatch(logIn());
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LoginPrompt);
