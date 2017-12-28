import {connect} from 'react-redux';
import EditorsColumn from '../components/EditorsColumn';

import {
  getCurrentProject,
} from '../selectors';
import {
  hideComponent,
  unhideComponent,
  dragDivider,
  updateProjectSource,
  editorFocusedRequestedLine,
  storeResizableSectionRef
} from '../actions';

function mapStateToProps(state) {
  return {
    currentProject: getCurrentProject(state),
    editorsFlex: state.getIn(['ui', 'workspace', 'editors', 'flex']).toJS(),
    rowsFlex: state.getIn(['ui', 'workspace', 'columns', 'flex']).toJS(),
    errors: state.get('errors').toJS(),
    ui: state.get('ui').toJS(),
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
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EditorsColumn);
