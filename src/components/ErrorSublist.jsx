var React = require('react');
var lodash = require('lodash');
var i18n = require('i18next-client');

var ErrorItem = require('./ErrorItem');

var ErrorSublist = React.createClass({
  propTypes: {
    errors: React.PropTypes.array.isRequired,
    onErrorClicked: React.PropTypes.func.isRequired,
    language: React.PropTypes.oneOf(['html', 'css', 'javascript']).isRequired,
  },

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

module.exports = ErrorSublist;
