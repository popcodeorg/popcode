import React from 'react';
import PropTypes from 'prop-types';
import {ConsoleEntry as ConsoleEntryRecord} from '../records';

export default function ConsoleEntry({
  entry: {expression, status, value, error},
}) {
  let output;

  if (status === 'evaluated' && value !== undefined) {
    output = <div className="console__value">=&gt; {value} </div>;
  } else if (status === 'error' && error !== undefined) {
    output = (
      <div className="console__error">
        {error.name}: {error.message}
      </div>
    );
  }

  return (
    <div className="console__entry">
      <div className="console__expression">{expression}</div>
      {output}
    </div>
  );
}

ConsoleEntry.propTypes = {
  entry: PropTypes.instanceOf(ConsoleEntryRecord).isRequired,
};
