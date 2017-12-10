import isNil from 'lodash/isNil';
import React from 'react';
import PropTypes from 'prop-types';
import {ConsoleEntry} from '../records';

export default function ConsoleOutput({entry: {value, error}}) {
  if (!isNil(value)) {
    return <div className="console__value">=&gt; {value} </div>;
  }

  if (!isNil(error)) {
    return (
      <div className="console__error">
        {error.name}: {error.message}
      </div>
    );
  }

  return null;
}

ConsoleOutput.propTypes = {
  entry: PropTypes.instanceOf(ConsoleEntry).isRequired,
};
