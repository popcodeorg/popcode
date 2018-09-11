import {connect} from 'react-redux';

import TestCreatorPane from '../components/TestCreatorPane';
import {
  closeTestCreatorPane,
  saveTests,
  addTest,
} from '../actions';
import {
  isTestCreatorPaneOpen,
  getCurrentProjectKey,
  getCurrentProjectTests,
} from '../selectors';

function mapStateToProps(state) {
  return {
    isTestCreatorPaneOpen: isTestCreatorPaneOpen(state),
    tests: getCurrentProjectTests(state),
    projectKey: getCurrentProjectKey(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onAddTest(projectKey) {
      dispatch(addTest(projectKey));
    },

    onCloseTestCreatorPane() {
      dispatch(closeTestCreatorPane());
    },

    onSaveTests(tests, currentProjectKey) {
      dispatch(saveTests(tests, currentProjectKey));
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TestCreatorPane);
