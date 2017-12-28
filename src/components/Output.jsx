import React from 'react';
import PropTypes from 'prop-types';
import prefixAll from 'inline-style-prefixer/static';
import {DraggableCore} from 'react-draggable';
import ErrorReport from '../containers/ErrorReport';
import Preview from '../containers/Preview';
import Console from '../containers/Console';
import partial from 'lodash/partial';

export default function Output({
  isDraggingColumnDivider,
  isDraggingOutputDivider,
  isTopBarMenuOpen,
  outputDividerRef,
  outputRowRef,
  style,
  onOutputDividerDrag,
  onOutputDividerStart,
  onOutputDividerStop,
  onStoreColumnRef,
  onStoreOutputDividerRef,
}) {
  
  const ignorePointerEvents = isDraggingColumnDivider ||
    isDraggingOutputDivider || isTopBarMenuOpen

  return (
    <div
      className="environment__column"
      ref={onStoreColumnRef}
      style={prefixAll(Object.assign({}, style, {
        pointerEvents: ignorePointerEvents ? 'none' : 'all',
      }))}
    >
      <div className="environment__column-contents output">
        <Preview />
        <DraggableCore
          onDrag={partial(onOutputDividerDrag, outputDividerRef, outputRowRef)}
          onStart={onOutputDividerStart}
          onStop={onOutputDividerStop}
        >
          <div
            className="output__row-divider"
            ref={onStoreOutputDividerRef}
          />
        </DraggableCore>
        <Console />
        <ErrorReport />
      </div>
    </div>
  );
}

Output.propTypes = {
  // style: PropTypes.object.isRequired,
  // onOutputDividerDrag: PropTypes.func.isRequired,
  // onOutputDividerStart: PropTypes.func.isRequired,
  // onOutputDividerStop: PropTypes.func.isRequired,
  // onStoreColumnRef: PropTypes.func.isRequired,
  // onStoreOutputDividerRef: PropTypes.func.isRequired,
};
