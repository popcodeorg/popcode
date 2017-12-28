import {connect} from 'react-redux';
import Output from '../components/Output';
import {
  getNodeHeight,
  getNodeHeights,
} from '../util/resize';
import {

} from '../selectors';
import {
  dragDivider,
  startDragDivider,
  stopDragDivider,
  storeResizableSectionRef,
  storeDividerRef,
} from '../actions';

function mapStateToProps(state) {
  return {
    isDraggingColumnDivider: state.getIn(
      ['ui', 'workspace', 'columns','isDraggingDivider'],
    ),
    isDraggingOutputDivider: state.getIn(
      ['ui', 'workspace', 'output', 'isDraggingDivider'],
    ),
    isTopBarMenuOpen: false,
    style: null,
    outputDividerRef: state.getIn(
      ['ui', 'workspace', 'output','dividerRef'],
    ),
    outputRowRef: state.getIn(
      ['ui', 'workspace', 'output', 'refs'],
    ).toJS(),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onDividerDrag(outputDividerRef, outputRowRef, {deltaY, lastY, y}) {
      console.log(outputRowRef);
      dispatch(dragDivider('output', {
        dividerHeight: getNodeHeight(outputDividerRef),
        rowHeights: getNodeHeights(outputRowRef),
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
      console.log(ref)
      dispatch(storeResizableSectionRef('columns', 1, ref));
    },
    onStoreDividerRef(ref) {
      dispatch(storeDividerRef('output', ref));
    },
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Output);
