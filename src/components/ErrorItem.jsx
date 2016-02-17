import React from 'react';
import partial from 'lodash/partial';

var ErrorItem = React.createClass({
  propTypes: {
    row: React.PropTypes.number.isRequired,
    column: React.PropTypes.number.isRequired,
    text: React.PropTypes.string.isRequired,
    onClick: React.PropTypes.func.isRequired,
  },

  render: function() {
    var lineNumber = this.props.row + 1;

    return (
      <li
        className="errorList-error"
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
  },
});

module.exports = ErrorItem;
