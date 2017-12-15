import React from 'react';
import PropTypes from 'prop-types';
import {ConsoleEntry as ConsoleEntryRecord} from '../records';
import ConsoleOutput from './ConsoleOutput';

export default function ConsoleEntry({entry, currentCompiledProjectKey}) {
  const {expression, compiledProjectKey} = entry;
  const isActive = currentCompiledProjectKey === compiledProjectKey;
  return (
    <div className={isActive ? 'console__entry' : 'console__entry_inactive'}>
      <div className="console__expression">{expression}</div>
      <ConsoleOutput entry={entry} />
    </div>
  );
}

ConsoleEntry.propTypes = {
  currentCompiledProjectKey: PropTypes.number.isRequired,
  entry: PropTypes.instanceOf(ConsoleEntryRecord).isRequired,
};
