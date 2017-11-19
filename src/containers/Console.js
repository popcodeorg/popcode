import {connect} from 'react-redux';
import Console from '../components/Console';
import {getConsoleHistory} from '../selectors';
import {evaluateConsoleInput} from '../actions';

function mapStateToProps(state) {
  return {
    history: getConsoleHistory(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onInput(input) {
      dispatch(evaluateConsoleInput(input));
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Console);
