import {connect} from 'react-redux';

import TestResultsPane from '../components/TestResultsPane';
import {closeTestResultsPane} from '../actions';
import {getTestResults, isTestResultsPaneOpen} from '../selectors';

function mapStateToProps(state) {
  return {
    isTestResultsPaneOpen: isTestResultsPaneOpen(state),
    testResults: getTestResults(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onCloseTestResultsPane() {
      dispatch(closeTestResultsPane());
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TestResultsPane);
