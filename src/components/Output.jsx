import React from 'react';
import PropTypes from 'prop-types';
import prefixAll from 'inline-style-prefixer/static';
import ErrorReport from '../containers/ErrorReport';
import Preview from '../containers/Preview';
import Console from '../containers/Console';

export default function Output({
  ignorePointerEvents,
  style,
  onRef,
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
        <Console />
        <ErrorReport />
      </div>
    </div>
  );
}

Output.propTypes = {
  ignorePointerEvents: PropTypes.bool.isRequired,
  style: PropTypes.object.isRequired,
  onRef: PropTypes.func.isRequired,
};
