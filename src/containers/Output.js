import {connect} from 'react-redux';
import Output from '../components/Output';
import {
  getNodeHeight,
  getNodeHeights,
} from '../util/resize';
import {

} from '../selectors';
import {
  dragOutputDivider,
  startDragOutputDivider,
  stopDragOutputDivider,
  updateColumnRef,
  storeOutputDividerRef,
} from '../actions';

function mapStateToProps(state) {
  return {
    isDraggingColumnDivider: state.getIn(
      ['ui', 'workspace', 'isDraggingColumnDivider'],
    ),
    isDraggingOutputDivider: state.getIn(
      ['ui', 'workspace', 'isDraggingOutputDivider'],
    ),
    isTopBarMenuOpen: false,
    style: null,
    outputDividerRef: state.getIn(
      ['ui', 'workspace', 'outputDividerRef'],
    ),
    outputRowRef: state.getIn(
      ['ui', 'workspace', 'outputRowRef'],
    ).toJS(),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onOutputDividerDrag(outputDividerRef, outputRowRef, {deltaY, lastY, y}) {
      dispatch(dragOutputDivider({
        dividerHeight: getNodeHeight(outputDividerRef),
        rowHeights: getNodeHeights(outputRowRef),
        deltaY,
        lastY,
        y,
      }));
    },
    onOutputDividerStart() {
      dispatch(startDragOutputDivider());
    },
    onOutputDividerStop() {
      dispatch(stopDragOutputDivider());
    },
    onStoreColumnRef(column) {
      dispatch(updateColumnRef(1, column));
    },
    onStoreOutputDividerRef(ref) {
      dispatch(storeOutputDividerRef(ref));
    },
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Output);
