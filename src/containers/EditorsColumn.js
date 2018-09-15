import {connect} from 'react-redux';

import EditorsColumn from '../components/EditorsColumn';
import resizableFlex from '../higherOrderComponents/resizableFlex';
import {
  getCurrentProject,
  getErrors,
  getRequestedFocusedLine,
  isTextSizeLarge,
} from '../selectors';
import {
  currentCursorChanged,
  editorFocusedRequestedLine,
  hideComponent,
  updateProjectSource,
  unhideComponent,
  editorBlurred,
  editorFocused,
} from '../actions';

function mapStateToProps(state) {
  return {
    currentProject: getCurrentProject(state),
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

    onEditorInput(projectKey, language, source) {
      dispatch(updateProjectSource(projectKey, language, source));
    },

    onRequestedLineFocused() {
      dispatch(editorFocusedRequestedLine());
    },

    onEditorCursorChange(source, cursor, language) {
      dispatch(
        currentCursorChanged(
          source,
          cursor,
          language,
        ),
      );
    },

    onEditorBlurred() {
      dispatch(
        editorBlurred(),
      );
    },

    onEditorFocused(source, cursor, language) {
      dispatch(
        editorFocused(
          source,
          cursor,
          language,
        ),
      );
    },

  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(resizableFlex(3)(EditorsColumn));
