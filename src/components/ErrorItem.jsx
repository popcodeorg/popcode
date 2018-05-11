import React from 'react';
import PropTypes from 'prop-types';
import partial from 'lodash-es/partial';
import remark from 'remark';
import remarkReact from 'remark-react';

const parser = remark().use(remarkReact);

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
      <div className="error-list__message">
        {parser.processSync(props.raw).contents}
      </div>
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
