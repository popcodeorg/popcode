var React = require('react');
var _ = require('lodash');

var ErrorSublist = React.createClass({
  render: function() {
    if (this.props.errors.length === 0) {
      return false;
    }

    var errors = _.map(this.props.errors, function(error) {
      return (
        <li className="errorList-error">
          <span class="errorList-error-line">Line {error.row + 1}:</span>
          <span class="errorList-error-message">{error.text}</span>
        </li>
      );
    });

    return (
      <div className="errorList-errorSublist">
        <h2 className="errorList-errorSublist-header">
          You have {this.props.errors.length} errors in your {this.props.language}!
        </h2>
        <ul className="errorList-errorSublist-list">
          {errors}
        </ul>
      </div>
    )
  }
});

var ErrorList = React.createClass({
  render: function() {
    return (
      <div className="errorList">
        <ErrorSublist language="html" errors={this.props.html} />
        <ErrorSublist language="css" errors={this.props.css} />
        <ErrorSublist language="javascript" errors={this.props.javascript} />
      </div>
    );
  }
});

module.exports = ErrorList;
