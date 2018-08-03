import isNil from 'lodash-es/isNil';
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Inspector from 'react-inspector';

import {ConsoleEntry} from '../records';

function deserialize(serializedJavascript) {
  // eslint-disable-next-line no-eval
  return eval(`(${serializedJavascript})`);
}

export default function ConsoleOutput({entry, isActive}) {
  const {expression, value, error} = entry;
  const chevron = expression ?
    <div className="console__chevron console__chevron_outdent">&#xf053;</div> :
    null;

  if (!isNil(value)) {
    return (
      <div
        className={
          classnames(
            'console__row',
            'console__value',
            {console__value_inactive: !isActive},
          )
        }
      >
        {chevron}
        {Object.keys(deserialize(value)).map(
          (a, i) => (
            <Inspector
              data={deserialize(value)[i]}
            />
          ),
        )}
      </div>
    );
  }

  if (!isNil(error)) {
    return (
      <div
        className={
          classnames(
            'console__error',
            {console__error_inactive: !isActive},
          )
        }
      >
        {error.name}: {error.message}
      </div>
    );
  }

  return null;
}

ConsoleOutput.propTypes = {
  entry: PropTypes.instanceOf(ConsoleEntry).isRequired,
  isActive: PropTypes.bool.isRequired,
};
