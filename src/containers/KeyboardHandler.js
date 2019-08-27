import {connect} from 'react-redux';

import KeyboardHandler from '../components/KeyboardHandler';

import {saveProject} from '../actions';

function mapDispatchToProps(dispatch) {
  return {
    onSave() {
      dispatch(saveProject());
    },
  };
}

export default connect(
  null,
  mapDispatchToProps,
)(KeyboardHandler);
