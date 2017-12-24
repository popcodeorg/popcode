import React from 'react';
import PropTypes from 'prop-types';
import prefixAll from 'inline-style-prefixer/static';
import {DraggableCore} from 'react-draggable';
import ErrorReport from '../containers/ErrorReport';
import Preview from '../containers/Preview';
import Console from '../containers/Console';

export default function Output({
  ignorePointerEvents,
  style,
  onOutputDividerDrag,
  onOutputDividerStart,
  onOutputDividerStop,
  onRef,
  onStoreOutputDividerRef,
}) {
  return (
    <div
      className="environment__column"
      ref={onRef}
      style={prefixAll(Object.assign({}, style, {
        pointerEvents: ignorePointerEvents ? 'none' : 'all',
      }))}
    >
      <div className="environment__columnContents output">
        <Preview />
        <DraggableCore
          onDrag={onOutputDividerDrag}
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
  ignorePointerEvents: PropTypes.bool.isRequired,
  style: PropTypes.object.isRequired,
  onOutputDividerDrag: PropTypes.func.isRequired,
  onOutputDividerStart: PropTypes.func.isRequired,
  onOutputDividerStop: PropTypes.func.isRequired,
  onRef: PropTypes.func.isRequired,
  onStoreOutputDividerRef: PropTypes.func.isRequired,
};
