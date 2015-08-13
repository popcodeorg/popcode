var React = require('react');
var _ = require('lodash');
var Preview = require('./preview.jsx');
var ErrorList = require('./errorList.jsx');

var Output = React.createClass({
  render: function() {
    var allValid = _.every(this.props.errors, function(errors) {
      return errors.length === 0;
    });

    if (allValid) {
      return (
        <Preview {...this.props.sources} />
      );
    } else {
      return (
        <ErrorList {...this.props.errors} onErrorClicked={this.props.onErrorClicked} />
      );
    }
  }
});

module.exports = Output;
