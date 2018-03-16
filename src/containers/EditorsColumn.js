import {connect} from 'react-redux';
import EditorsColumn from '../components/EditorsColumn';

import {
  getCurrentProject,
  getErrors,
  getRequestedFocusedLine,
  makeGetResizableSectionFlex,
  isTextSizeLarge,
  makeGetDividerRefs,
  makeGetResizableSectionRefs,
} from '../selectors';
import {
  hideComponent,
  unhideComponent,
  dragDivider,
  updateProjectSource,
  editorFocusedRequestedLine,
  storeResizableSectionRef,
  storeDividerRef,
} from '../actions';

function mapStateToProps(state) {
  const getResizableSectionFlex = makeGetResizableSectionFlex();
  const getDividerRefs = makeGetDividerRefs();
  const getResizableSectionRefs = makeGetResizableSectionRefs();
  return {
    currentProject: getCurrentProject(state),
    editorDividerRefs: getDividerRefs(state, 'editors'),
    editorRowRefs: getResizableSectionRefs(state, 'editors'),
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

    onStoreDividerRef(index, ref) {
      dispatch(storeDividerRef('editors', index, ref));
    },

    onStoreEditorRef(index, ref) {
      dispatch(storeResizableSectionRef('editors', index, ref));
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
