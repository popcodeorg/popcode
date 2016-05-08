import React from 'react';
import partial from 'lodash/partial';

function ErrorItem(props) {
  return (
    <li
      className="errorList-error"
      data-error-reason={props.reason}
      onClick={partial(
        props.onClick,
        props.row,
        props.column
      )}
    >
      <span className="errorList-error-line">{props.row + 1}</span>
      <span className="errorList-error-message">{props.text}</span>
    </li>
  );
}

ErrorItem.propTypes = {
  column: React.PropTypes.number.isRequired,
  reason: React.PropTypes.string.isRequired,
  row: React.PropTypes.number.isRequired,
  text: React.PropTypes.string.isRequired,
  onClick: React.PropTypes.func.isRequired,
};

export default ErrorItem;
