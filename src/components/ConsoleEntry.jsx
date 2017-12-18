import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import {ConsoleEntry as ConsoleEntryRecord} from '../records';
import ConsoleOutput from './ConsoleOutput';

export default function ConsoleEntry({entry, isActive}) {
  const {expression} = entry;
  return (
    <div className="console__entry">
      <div
        className={
          classnames(
            'console__expression',
            {console__expression_inactive: !isActive},
          )
        }
      >
        {expression}
      </div>
      <ConsoleOutput
        entry={entry}
        isActive={isActive}
      />
    </div>
  );
}

ConsoleEntry.propTypes = {
  entry: PropTypes.instanceOf(ConsoleEntryRecord).isRequired,
  isActive: PropTypes.bool.isRequired,
};
