import {connect} from 'react-redux';
import Output from '../components/Output';
import {
  getNodeHeight,
  getNodeHeights,
} from '../util/resize';
import {
  makeGetDividerRefs,
  makeGetResizableSectionRefs,
  makeIsDraggingDivider,
  getOpenTopBarMenu,
  makeGetResizableSectionFlex,
} from '../selectors';
import {
  dragDivider,
  startDragDivider,
  stopDragDivider,
  storeResizableSectionRef,
  storeDividerRef,
} from '../actions';

function mapStateToProps(state) {
  const isDraggingDivider = makeIsDraggingDivider();
  const getResizableSectionRefs = makeGetResizableSectionRefs();
  const getResizableSectionFlex = makeGetResizableSectionFlex();
  const getDividerRefs = makeGetDividerRefs();
  return {
    environmentColumnFlex: getResizableSectionFlex(state, 'columns'),
    isDraggingColumnDivider: isDraggingDivider(state, 'columns'),
    isDraggingOutputDivider: isDraggingDivider(state, 'output'),
    openTopBarMenu: getOpenTopBarMenu(state),
    outputDividerRefs: getDividerRefs(state, 'output'),
    outputRowRefs: getResizableSectionRefs(state, 'output'),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onDividerDrag(outputDividerRef, outputRowRefs, {deltaY, lastY, y}) {
      dispatch(dragDivider('output', {
        dividerHeight: getNodeHeight(outputDividerRef),
        rowHeights: getNodeHeights(outputRowRefs),
        deltaY,
        lastY,
        y,
      }));
    },
    onDividerStart() {
      dispatch(startDragDivider('output'));
    },
    onDividerStop() {
      dispatch(stopDragDivider('output'));
    },
    onStoreColumnRef(ref) {
      dispatch(storeResizableSectionRef('columns', 1, ref));
    },
    onStoreDividerRef(ref) {
      dispatch(storeDividerRef('output', 0, ref));
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Output);
