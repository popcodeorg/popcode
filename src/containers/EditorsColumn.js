import {connect} from 'react-redux';

import {
  beautifyProjectSource,
  editorFocusedRequestedLine,
  hideComponent,
  saveProject,
  updateProjectSource,
} from '../actions';
import {editorReady} from '../actions/instrumentation';
import EditorsColumn from '../components/EditorsColumn';
import resizableFlex from '../higherOrderComponents/resizableFlex';
import {
  getCurrentProject,
  getErrors,
  getHiddenAndVisibleLanguages,
  getRemoteConfig,
  getRequestedFocusedLine,
  isTextSizeLarge,
} from '../selectors';

function mapStateToProps(state) {
  const {visibleLanguages} = getHiddenAndVisibleLanguages(state);
  return {
    currentProject: getCurrentProject(state),
    errors: getErrors(state),
    implementation: getRemoteConfig(state).get('editor', 'ace'),
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

    onEditorReady(language, timestamp) {
      dispatch(editorReady(language, timestamp));
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
