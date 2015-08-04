var React = require('react');
var _ = require('lodash');
var i18n = require('i18next-client');

var ErrorItem = React.createClass({
  render: function() {
    return (
      <li className="errorList-error" onClick={_.partial(this.props.onClick, this.props.row, this.props.column)}>
        <span class="errorList-error-line">Line {this.props.row + 1}:</span>
        <span class="errorList-error-message">{this.props.text}</span>
      </li>
    );
  }
});

var ErrorSublist = React.createClass({
  render: function() {
    if (this.props.errors.length === 0) {
      return false;
    }

    var errors = _.map(this.props.errors, function(error) {
      return <ErrorItem {...error} onClick={_.partial(this.props.onErrorClicked, this.props.language)} />
    }.bind(this));
    var error_message = i18n.t("errors.notice", { amount: this.props.errors.length, language: this.props.language });

    return (
      <div className="errorList-errorSublist">
        <h2 className="errorList-errorSublist-header">
          {error_message}
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
        <ErrorSublist language="html" errors={this.props.html} onErrorClicked={this.props.onErrorClicked} />
        <ErrorSublist language="css" errors={this.props.css} onErrorClicked={this.props.onErrorClicked} />
        <ErrorSublist language="javascript" errors={this.props.javascript} onErrorClicked={this.props.onErrorClicked} />
      </div>
    );
  }
});

module.exports = ErrorList;
