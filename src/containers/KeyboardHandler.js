import {connect} from 'react-redux';

import KeyboardHandler from '../components/KeyboardHandler';

import {saveProject} from '../actions';

function mapStateToProps() {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    onSave() {
      dispatch(saveProject());
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(KeyboardHandler);
