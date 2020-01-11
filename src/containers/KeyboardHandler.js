import {connect} from 'react-redux';

import {saveProject} from '../actions';
import KeyboardHandler from '../components/KeyboardHandler';

function mapDispatchToProps(dispatch) {
  return {
    onSave() {
      dispatch(saveProject());
    },
  };
}

export default connect(null, mapDispatchToProps)(KeyboardHandler);
