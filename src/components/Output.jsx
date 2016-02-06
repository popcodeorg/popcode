var React = require('react');
var isEmpty = require('lodash/isEmpty');

var ErrorList = require('./ErrorList');
var Preview = require('./Preview');

var Output = React.createClass({
  propTypes: {
    project: React.PropTypes.object.isRequired,
    hasErrors: React.PropTypes.bool.isRequired,
    errors: React.PropTypes.object.isRequired,
    runtimeErrors: React.PropTypes.array.isRequired,
    onErrorClicked: React.PropTypes.func.isRequired,
    onRuntimeError: React.PropTypes.func.isRequired,
    clearRuntimeErrors: React.PropTypes.func.isRequired,
  },

  _renderErrorList: function(props) {
    return (
      <ErrorList
        {...props}
        onErrorClicked={this.props.onErrorClicked}
      />
    );
  },

  _renderPreview: function() {
    return (
      <Preview
        project={this.props.project}
        onRuntimeError={this.props.onRuntimeError}
        clearRuntimeErrors={this.props.clearRuntimeErrors}
      />
    );
  },

  render: function() {
    if (this.props.hasErrors) {
      return (
        <div className="environment-rightColumn">
          {this._renderErrorList(this.props.errors)}
        </div>
      );
    }

    if (!this.props.project) {
      return null;
    }

    var errorList;

    if (!isEmpty(this.props.runtimeErrors)) {
      errorList = this._renderErrorList({
        html: [],
        css: [],
        javascript: this.props.runtimeErrors,
        docked: true,
      });
    }

    return (
      <div className="environment-rightColumn">
        {this._renderPreview()}
        {errorList}
      </div>
    );
  },
});

module.exports = Output;
