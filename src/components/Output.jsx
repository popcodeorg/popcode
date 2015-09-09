var React = require('react');
var _ = require('lodash');

var ErrorStore = require('../stores/ErrorStore');
var Preview = require('./Preview.jsx');
var ErrorList = require('./ErrorList.jsx');

var Output = React.createClass({
  getInitialState: function() {
    return this._calculateState();
  },

  componentDidMount: function() {
    ErrorStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    ErrorStore.removeChangeListener(this._onChange);
  },

  render: function() {
    if (this.state.hasErrors) {
      return (
        <ErrorList
          {...this.state.errors}
          onErrorClicked={this.props.onErrorClicked} />
      );
    } else {
      return (
        <Preview projectKey={this.props.projectKey} />
      );
    }
  },

  _onChange: function() {
    this.setState(this._calculateState());
  },

  _calculateState: function() {
    return {
      hasErrors: ErrorStore.anyErrors(this.props.projectKey),
      errors: ErrorStore.getErrors(this.props.projectKey)
    }
  }
});

module.exports = Output;
