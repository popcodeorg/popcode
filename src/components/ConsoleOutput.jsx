import isNil from 'lodash/isNil';
import React from 'react';
import PropTypes from 'prop-types';
import {ConsoleEntry} from '../records';

export default function ConsoleOutput({entry, currentCompiledProjectKey}) {
  const {value, error, evaluatedByCompiledProjectKey} = entry;
  const isActive = currentCompiledProjectKey === evaluatedByCompiledProjectKey;

  if (!isNil(value)) {
    return (
      <div className={isActive ? 'console__value' : 'console__value_inactive'}>
        =&gt; {value}
      </div>
    );
  }

  if (!isNil(error)) {
    return (
      <div className={isActive ? 'console__error' : 'console__error_inactive'}>
        {error.name}: {error.message}
      </div>
    );
  }

  return null;
}

ConsoleOutput.propTypes = {
  currentCompiledProjectKey: PropTypes.number.isRequired,
  entry: PropTypes.instanceOf(ConsoleEntry).isRequired,
};
