import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import {library} from '@fortawesome/fontawesome-svg-core';
import {faChevronRight} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import isNil from 'lodash-es/isNil';

import {ConsoleEntry as ConsoleEntryRecord} from '../records';

library.add(faChevronRight);

export default function ConsoleExpression({entry: {expression}, isActive}) {
  if (isNil(expression)) {
    return null;
  }

  return (
    <div
      className={
        classnames(
          'console__row',
          'console__expression',
          {console__expression_inactive: !isActive},
        )
      }
    >
      <div className="console__chevron">
        <FontAwesomeIcon icon="chevron-right" />
      </div>
      {expression}
    </div>
  );
}

ConsoleExpression.propTypes = {
  entry: PropTypes.instanceOf(ConsoleEntryRecord).isRequired,
  isActive: PropTypes.bool.isRequired,
};

ConsoleExpression.defaultProps = {
  expression: null,
};
