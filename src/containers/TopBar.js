import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {TopBar} from '../components';
import {
  getCurrentValidationState,
  isDashboardOpen,
  isUserTyping,
} from '../selectors';
import {
  toggleDashboard,
} from '../actions';

function mapStateToProps(state) {
  return {
    isHamburgerMenuActive: isDashboardOpen(state),
    isUserTyping: isUserTyping(state),
    validationState: getCurrentValidationState(state),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    onClickHamburgerMenu: toggleDashboard,
  }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TopBar);
