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
    delayErrorDisplay: React.PropTypes.bool.isRequired,
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

  _renderRuntimeErrorList: function() {
    if (!isEmpty(this.props.runtimeErrors) && !this.props.delayErrorDisplay) {
      return this._renderErrorList({
        html: [],
        css: [],
        javascript: this.props.runtimeErrors,
        docked: true,
      });
    }
  },

  render: function() {
    if (this.props.hasErrors) {
      if (this.props.delayErrorDisplay) {
        return (
          <div className="environment-rightColumn">
            <div className="delayedErrorOverlay" />
          </div>
        );
      }

      return (
        <div className="environment-rightColumn">
          {this._renderErrorList(this.props.errors)}
        </div>
      );
    }

    if (!this.props.project) {
      return null;
    }

    return (
      <div className="environment-rightColumn">
        {this._renderPreview()}
        {this._renderRuntimeErrorList()}
      </div>
    );
  },
});

module.exports = Output;
