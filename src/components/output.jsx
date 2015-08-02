var React = require('react');
var _ = require('lodash');
var Preview = require('./preview.jsx');
var ErrorList = require('./errorList.jsx');

var Output = React.createClass({
  render: function() {
    var allValid = _.every(this.props, function(languageProps) {
      return languageProps.errors.length === 0;
    });

    if (allValid) {
      return (
        <Preview html={this.props.html.source}
          css={this.props.css.source}
          javascript={this.props.javascript.source} />
      );
    } else {
      return (
        <ErrorList html={this.props.html.errors}
          css={this.props.css.errors}
          javascript={this.props.javascript.errors} />
      );
    }
  }
});

module.exports = Output;
