import React from 'react';
import partial from 'lodash/partial';

function ErrorItem(props) {
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
      <div>{props.row + 1}</div>
      <div className="error-list__message">{props.text}</div>
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
