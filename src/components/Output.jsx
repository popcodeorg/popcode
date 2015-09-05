var React = require('react');
var _ = require('lodash');
var Preview = require('./Preview.jsx');
var ErrorList = require('./ErrorList.jsx');

var Output = React.createClass({
  render: function() {
    var allValid = _.every(this.props.errors, function(errors) {
      return errors.length === 0;
    });

    if (allValid) {
      return (
        <Preview
          sources={this.props.sources}
          enabledLibraries={this.props.enabledLibraries} />
      );
    } else {
      return (
        <ErrorList
          {...this.props.errors}
          onErrorClicked={this.props.onErrorClicked} />
      );
    }
  }
});

module.exports = Output;
