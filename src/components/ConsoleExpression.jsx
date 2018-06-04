import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import isNil from 'lodash-es/isNil';

import {ConsoleEntry as ConsoleEntryRecord} from '../records';

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
      <div className="console__chevron">&#xf054;</div>
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
