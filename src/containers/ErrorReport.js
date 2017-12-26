import {connect} from 'react-redux';
import ErrorReport from '../components/ErrorReport';
import {focusLine} from '../actions';
import {
  getErrors,
  isCurrentlyValidating,
  isCurrentProjectSyntacticallyValid,
  isUserTyping,
} from '../selectors';

function mapStateToProps(state) {
  return {
    errors: getErrors(state),
    isValidating: isCurrentlyValidating(state) ||
      (isUserTyping(state) && !isCurrentProjectSyntacticallyValid(state)),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onErrorClick(language, line, column) {
      dispatch(focusLine(`editor.${language}`, line, column));
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ErrorReport);
