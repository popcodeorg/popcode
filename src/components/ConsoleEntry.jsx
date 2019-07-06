import React from 'react';
import PropTypes from 'prop-types';

import {ConsoleEntry as ConsoleEntryRecord} from '../records';

import ConsoleExpression from './ConsoleExpression';
import ConsoleOutput from './ConsoleOutput';
import styles from './ConsoleEntry.module.css';

export default function ConsoleEntry({entry, isActive}) {
  return (
    <div className={styles.entry}>
      <ConsoleExpression entry={entry} isActive={isActive} />
      <ConsoleOutput entry={entry} isActive={isActive} />
    </div>
  );
}

ConsoleEntry.propTypes = {
  entry: PropTypes.instanceOf(ConsoleEntryRecord).isRequired,
  isActive: PropTypes.bool.isRequired,
};
