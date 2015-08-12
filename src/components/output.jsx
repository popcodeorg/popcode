var React = require('react');
var _ = require('lodash');
var Preview = require('./preview.jsx');
var ErrorList = require('./errorList.jsx');

var Output = React.createClass({
  render: function() {
    var allValid = _.every(this.props.inputs, function(languageProps) {
      return languageProps.errors.length === 0;
    });

    if (allValid) {
      return (
        <Preview html={this.props.inputs.html.source}
          css={this.props.inputs.css.source}
          javascript={this.props.inputs.javascript.source} />
      );
    } else {
      return (
        <ErrorList html={this.props.inputs.html.errors}
          css={this.props.inputs.css.errors}
          javascript={this.props.inputs.javascript.errors}
          onErrorClicked={this.props.onErrorClicked} />
      );
    }
  }
});

module.exports = Output;
