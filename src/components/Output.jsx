var React = require('react');
var _ = require('lodash');

var ErrorStore = require('../stores/ErrorStore');
var ProjectStore = require('../stores/ProjectStore');
var Preview = require('./Preview.jsx');
var ErrorList = require('./ErrorList.jsx');

var Output = React.createClass({
  getInitialState: function() {
    return this._calculateState();
  },

  componentDidMount: function() {
    ProjectStore.addChangeListener(this._onChange);
    ErrorStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    ProjectStore.removeChangeListener(this._onChange);
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
        <Preview project={this._getProject()} />
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
  },

  _getProject: function() {
    return ProjectStore.get(this.props.projectKey);
  },
});

module.exports = Output;
