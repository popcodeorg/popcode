var React = require('react');
var i18n = require('i18n');
var lodash = require('lodash');

var ErrorItem = React.createClass({
  propTypes: {
    row: React.PropTypes.number,
    column: React.PropTypes.number,
    text: React.PropTypes.string,
    onClick: React.PropTypes.func,
  },

  render: function() {
    var lineNumber =
      i18n.t('errors.line-number', {number: this.props.row + 1});

    return (
      <li
        className="errorList-error"
        onClick={lodash.partial(
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
