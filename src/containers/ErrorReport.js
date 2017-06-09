import {connect} from 'react-redux';
import {ErrorReport} from '../components';
import {focusLine} from '../actions';

function mapStateToProps(state) {
  return {errors: state.get('errors').toJS()};
}

function mapDispatchToProps(dispatch) {
  return {
    onErrorClick(language, line, column) {
      dispatch(focusLine(language, line, column));
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ErrorReport);
