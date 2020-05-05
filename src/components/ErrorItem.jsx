import partial from 'lodash-es/partial';
import PropTypes from 'prop-types';
import React from 'react';

import {toReact} from '../util/markdown';

function ErrorItem(props) {
  const lineLabel = props.row >= 0 ? <div>On line {props.row + 1}:</div> : null;

  return (
    <li
      className="error-list__error"
      data-error-reason={props.reason}
      onClick={partial(props.onClick, props.row, props.column)}
    >
      {lineLabel}
      <div className="error-list__message">{toReact(props.raw)}</div>
    </li>
  );
}

ErrorItem.propTypes = {
  column: PropTypes.number.isRequired,
  raw: PropTypes.string.isRequired,
  reason: PropTypes.string.isRequired,
  row: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default ErrorItem;
