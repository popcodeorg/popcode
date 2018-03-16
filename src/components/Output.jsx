import React from 'react';
import PropTypes from 'prop-types';
import prefixAll from 'inline-style-prefixer/static';
import {DraggableCore} from 'react-draggable';
import partial from 'lodash/partial';
import ErrorReport from '../containers/ErrorReport';
import Preview from '../containers/Preview';
import Console from '../containers/Console';

export default function Output({
  isDraggingColumnDivider,
  isDraggingOutputDivider,
  openTopBarMenu,
  outputDividerRefs,
  outputRowRefs,
  environmentColumnFlex,
  onDividerDrag,
  onDividerStart,
  onDividerStop,
  onStoreColumnRef,
  onStoreDividerRef,
}) {
  const ignorePointerEvents = isDraggingColumnDivider ||
    isDraggingOutputDivider || Boolean(openTopBarMenu);

  return (
    <div
      className="environment__column"
      ref={onStoreColumnRef}
      style={prefixAll(Object.assign({}, {flex: environmentColumnFlex[1]}, {
        pointerEvents: ignorePointerEvents ? 'none' : 'all',
      }))}
    >
      <div className="environment__column-contents output">
        <Preview />
        <DraggableCore
          onDrag={partial(onDividerDrag, outputDividerRefs[0], outputRowRefs)}
          onStart={onDividerStart}
          onStop={onDividerStop}
        >
          <div
            className="output__row-divider"
            ref={onStoreDividerRef}
          />
        </DraggableCore>
        <Console />
        <ErrorReport />
      </div>
    </div>
  );
}

Output.propTypes = {
  environmentColumnFlex: PropTypes.array.isRequired,
  isDraggingColumnDivider: PropTypes.bool.isRequired,
  isDraggingOutputDivider: PropTypes.bool.isRequired,
  openTopBarMenu: PropTypes.string,
  outputDividerRefs: PropTypes.array.isRequired,
  outputRowRefs: PropTypes.array.isRequired,
  onDividerDrag: PropTypes.func.isRequired,
  onDividerStart: PropTypes.func.isRequired,
  onDividerStop: PropTypes.func.isRequired,
  onStoreColumnRef: PropTypes.func.isRequired,
  onStoreDividerRef: PropTypes.func.isRequired,
};

Output.defaultProps = {
  openTopBarMenu: null,
};
