import React from 'react';
import PropTypes from 'prop-types';
import {ConsoleEntry as ConsoleEntryRecord} from '../records';
import ConsoleOutput from './ConsoleOutput';

export default function ConsoleEntry({entry}) {
  const {expression} = entry;

  return (
    <div className="console__entry">
      <div className="console__expression">{expression}</div>
      <ConsoleOutput entry={entry} />
    </div>
  );
}

ConsoleEntry.propTypes = {
  entry: PropTypes.instanceOf(ConsoleEntryRecord).isRequired,
};
