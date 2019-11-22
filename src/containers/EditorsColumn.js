import {connect} from 'react-redux';

import EditorsColumn from '../components/EditorsColumn';
import resizableFlex from '../higherOrderComponents/resizableFlex';
import {
  getCurrentProject,
  getErrors,
  getHiddenAndVisibleLanguages,
  getRequestedFocusedLine,
  isTextSizeLarge,
} from '../selectors';
import {
  beautifyProjectSource,
  editorFocusedRequestedLine,
  hideComponent,
  updateProjectSource,
  saveProject,
} from '../actions';

function mapStateToProps(state) {
  const {visibleLanguages} = getHiddenAndVisibleLanguages(state);
  return {
    currentProject: getCurrentProject(state),
    errors: getErrors(state),
    isTextSizeLarge: isTextSizeLarge(state),
    requestedFocusedLine: getRequestedFocusedLine(state),
    visibleLanguages,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onComponentHide(projectKey, componentName) {
      dispatch(hideComponent(projectKey, componentName));
    },

    onEditorInput(projectKey, language, source) {
      dispatch(updateProjectSource(projectKey, language, source));
    },

    onRequestedLineFocused() {
      dispatch(editorFocusedRequestedLine());
    },

    onAutoFormat() {
      dispatch(beautifyProjectSource());
    },

    onSave() {
      dispatch(saveProject());
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(resizableFlex(3)(EditorsColumn));
