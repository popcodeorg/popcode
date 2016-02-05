var React = require('react');

var ErrorList = require('./ErrorList');
var Preview = require('./Preview');

var Output = React.createClass({
  propTypes: {
    project: React.PropTypes.object.isRequired,
    hasErrors: React.PropTypes.bool.isRequired,
    errors: React.PropTypes.object.isRequired,
    onErrorClicked: React.PropTypes.func.isRequired,
    onRuntimeError: React.PropTypes.func.isRequired,
    clearRuntimeErrors: React.PropTypes.func.isRequired,
  },

  render: function() {
    if (this.props.hasErrors) {
      return (
        <ErrorList
          {...this.props.errors}
          onErrorClicked={this.props.onErrorClicked}
        />
      );
    }
    if (this.props.project) {
      return (
        <Preview
          project={this.props.project}
          onRuntimeError={this.props.onRuntimeError}
          clearRuntimeErrors={this.props.clearRuntimeErrors}
        />
      );
    }
    return null;
  },
});

module.exports = Output;
