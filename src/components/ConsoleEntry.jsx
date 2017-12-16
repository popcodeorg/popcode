import React from 'react';
import PropTypes from 'prop-types';
import {ConsoleEntry as ConsoleEntryRecord} from '../records';
import ConsoleOutput from './ConsoleOutput';

export default function ConsoleEntry({entry, currentCompiledProjectKey}) {
  const {expression, evaluatedByCompiledProjectKey} = entry;
  const isActive = currentCompiledProjectKey === evaluatedByCompiledProjectKey;

  return (
    <div className="console__entry">
      <div
        className={
          isActive ? 'console__expression' : 'console__expression_inactive'
        }
      >
        {expression}
      </div>
      <ConsoleOutput
        currentCompiledProjectKey={currentCompiledProjectKey}
        entry={entry}
      />
    </div>
  );
}

ConsoleEntry.propTypes = {
  currentCompiledProjectKey: PropTypes.number.isRequired,
  entry: PropTypes.instanceOf(ConsoleEntryRecord).isRequired,
};
