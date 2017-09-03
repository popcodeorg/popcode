import React from 'react';
import PropTypes from 'prop-types';
import ErrorReport from '../containers/ErrorReport';
import Preview from '../containers/Preview';

export default function Output({
  isDraggingColumnDivider,
  style,
  onRef,
}) {
  return (
    <div
      className="environment__column"
      ref={onRef}
      style={Object.assign({}, style, {
        pointerEvents: isDraggingColumnDivider ? 'none' : 'all',
      })}
    >
      <div className="environment__columnContents output">
        <Preview />
        <ErrorReport />
      </div>
    </div>
  );
}

Output.propTypes = {
  isDraggingColumnDivider: PropTypes.bool.isRequired,
  style: PropTypes.object.isRequired,
  onRef: PropTypes.func.isRequired,
};
