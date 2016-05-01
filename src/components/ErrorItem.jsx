import React from 'react';
import partial from 'lodash/partial';

class ErrorItem extends React.Component {
  render() {
    const lineNumber = this.props.row + 1;

    return (
      <li
        className="errorList-error"
        data-error-reason={this.props.reason}
        onClick={partial(
          this.props.onClick,
          this.props.row,
          this.props.column
        )}
      >
        <span className="errorList-error-line">{lineNumber}</span>
        <span className="errorList-error-message">{this.props.text}</span>
      </li>
    );
  }
}

ErrorItem.propTypes = {
  row: React.PropTypes.number.isRequired,
  column: React.PropTypes.number.isRequired,
  text: React.PropTypes.string.isRequired,
  reason: React.PropTypes.string.isRequired,
  onClick: React.PropTypes.func.isRequired,
};

export default ErrorItem;
