import {connect} from 'react-redux';

import EditorsColumn from '../components/EditorsColumn';
import {
  getCurrentProject,
  getEditorsFlex,
  getErrors,
  getRequestedFocusedLine,
  isTextSizeLarge,
} from '../selectors';
import {
  dragRowDivider,
  editorFocusedRequestedLine,
  hideComponent,
  updateProjectSource,
  unhideComponent,
} from '../actions';

function mapStateToProps(state) {
  return {
    currentProject: getCurrentProject(state),
    editorsFlex: getEditorsFlex(state),
    errors: getErrors(state),
    isTextSizeLarge: isTextSizeLarge(state),
    requestedFocusedLine: getRequestedFocusedLine(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onComponentHide(projectKey, componentName) {
      dispatch(hideComponent(projectKey, componentName));
    },

    onComponentUnhide(projectKey, componentName) {
      dispatch(unhideComponent(projectKey, componentName));
    },

    onDividerDrag(data) {
      dispatch(dragRowDivider(data));
    },

    onEditorInput(projectKey, language, source) {
      dispatch(updateProjectSource(projectKey, language, source));
    },

    onRequestedLineFocused() {
      dispatch(editorFocusedRequestedLine());
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EditorsColumn);
