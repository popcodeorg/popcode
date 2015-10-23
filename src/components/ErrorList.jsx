var React = require('react');
var i18n = require('i18next-client');
var lodash = require('lodash');

var ErrorItem = React.createClass({
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

var ErrorSublist = React.createClass({
  render: function() {
    if (this.props.errors.length === 0) {
      return false;
    }

    var errors = lodash.map(this.props.errors, function(error) {
      return (
        <ErrorItem {...error}
          onClick={lodash.partial(
            this.props.onErrorClicked,
            this.props.language
          )}
        />
      );
    }.bind(this));

    var errorMessage = i18n.t(
      'errors.notice',
      {amount: this.props.errors.length, language: this.props.language}
    );

    return (
      <div className="errorList-errorSublist">
        <h2 className="errorList-errorSublist-header">
          {errorMessage}
        </h2>
        <ul className="errorList-errorSublist-list">
          {errors}
        </ul>
      </div>
    );
  },
});

var ErrorList = React.createClass({
  render: function() {
    return (
      <div className="errorList">
        <ErrorSublist
          language="html"
          errors={this.props.html}
          onErrorClicked={this.props.onErrorClicked}
        />
        <ErrorSublist
          language="css"
          errors={this.props.css}
          onErrorClicked={this.props.onErrorClicked}
        />
        <ErrorSublist
          language="javascript"
          errors={this.props.javascript}
          onErrorClicked={this.props.onErrorClicked}
        />
      </div>
    );
  },
});

module.exports = ErrorList;
