var React = require('react');
var _ = require('lodash');
var Preview = require('./preview.jsx');
var ErrorList = require('./errorList.jsx');

var Output = React.createClass({
  render: function() {
    var allValid = _.every(this.props.code, function(languageProps) {
      return languageProps.errors.length === 0;
    });

    if (allValid) {
      return (
        <Preview html={this.props.code.html.source}
          css={this.props.code.css.source}
          javascript={this.props.code.javascript.source} />
      );
    } else {
      return (
        <ErrorList html={this.props.code.html.errors}
          css={this.props.code.css.errors}
          javascript={this.props.code.javascript.errors}
          onErrorClicked={this.props.onErrorClicked} />
      );
    }
  }
});

module.exports = Output;
