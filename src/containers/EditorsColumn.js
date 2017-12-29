import {connect} from 'react-redux';
import EditorsColumn from '../components/EditorsColumn';

import {
  getCurrentProject,
  getErrors,
  getRequestedFocusedLine,
  getResizableSectionFlex,
  isTextSizeLarge,
} from '../selectors';
import {
  hideComponent,
  unhideComponent,
  dragDivider,
  updateProjectSource,
  editorFocusedRequestedLine,
  storeResizableSectionRef,
} from '../actions';

function mapStateToProps(state) {
  return {
    currentProject: getCurrentProject(state),
    editorsFlex: getResizableSectionFlex(state, 'editors'),
    environmentColumnFlex: getResizableSectionFlex(state, 'columns'),
    errors: getErrors(state),
    requestedFocusedLine: getRequestedFocusedLine(state),
    textSizeIsLarge: isTextSizeLarge(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onComponentHide(currentProjectKey, componentName) {
      dispatch(
        hideComponent(
          currentProjectKey,
          componentName,
        ),
      );
    },

    onComponentUnhide(currentProjectKey, componentName) {
      dispatch(
        unhideComponent(
          currentProjectKey,
          componentName,
        ),
      );
    },

    onDividerDrag(data) {
      dispatch(dragDivider('editors', data));
    },

    onEditorInput(currentProjectKey, language, source) {
      dispatch(
        updateProjectSource(
          currentProjectKey,
          language,
          source,
        ),
      );
    },

    onRef(ref) {
      dispatch(storeResizableSectionRef('columns', 0, ref));
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
