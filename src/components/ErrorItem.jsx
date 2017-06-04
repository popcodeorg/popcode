import React from 'react';
import PropTypes from 'prop-types';
import partial from 'lodash/partial';

function ErrorItem(props) {
  const lineLabel = props.row >= 0 ?
    <div>On line {props.row + 1}:</div> :
    null;

  return (
    <li
      className="error-list__error"
      data-error-reason={props.reason}
      onClick={partial(
        props.onClick,
        props.row,
        props.column,
      )}
    >
      {lineLabel}
      <div className="error-list__message">{props.text}</div>
    </li>
  );
}

ErrorItem.propTypes = {
  column: PropTypes.number.isRequired,
  reason: PropTypes.string.isRequired,
  row: PropTypes.number.isRequired,
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default ErrorItem;
