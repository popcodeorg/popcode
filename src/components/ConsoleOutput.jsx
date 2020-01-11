import {faChevronLeft} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import classnames from 'classnames';
import isNil from 'lodash-es/isNil';
import PropTypes from 'prop-types';
import React from 'react';

import {ConsoleEntry} from '../records';

export default function ConsoleOutput({entry, isActive}) {
  const {expression, value, error} = entry;
  const chevron = expression ? (
    <div className="console__chevron console__chevron_outdent">
      <FontAwesomeIcon icon={faChevronLeft} />
    </div>
  ) : null;

  if (!isNil(value)) {
    return (
      <div
        className={classnames('console__row', 'console__value', {
          console__value_inactive: !isActive,
        })}
      >
        {chevron}
        {value}
      </div>
    );
  }

  if (!isNil(error)) {
    return (
      <div
        className={classnames('console__error', {
          console__error_inactive: !isActive,
        })}
      >
        {error.text}
      </div>
    );
  }

  return null;
}

ConsoleOutput.propTypes = {
  entry: PropTypes.instanceOf(ConsoleEntry).isRequired,
  isActive: PropTypes.bool.isRequired,
};
