import React from 'react';
import isEmpty from 'lodash/isEmpty';
import ErrorList from './ErrorList';
import Preview from './Preview';

class Output extends React.Component {
  _renderErrorList(props) {
    return (
      <ErrorList
        {...props}
        onErrorClicked={this.props.onErrorClicked}
      />
    );
  }

  _renderPreview() {
    if (!this.props.project) {
      return null;
    }

    return (
      <Preview
        project={this.props.project}
        onRuntimeError={this.props.onRuntimeError}
        clearRuntimeErrors={this.props.clearRuntimeErrors}
      />
    );
  }

  _renderRuntimeErrorList() {
    if (!isEmpty(this.props.runtimeErrors) && !this.props.delayErrorDisplay) {
      return this._renderErrorList({
        html: [],
        css: [],
        javascript: this.props.runtimeErrors,
        docked: true,
      });
    }

    return null;
  }

  render() {
    if (this.props.hasErrors) {
      if (this.props.delayErrorDisplay) {
        return (
          <div className="environment-column">
            <div className="delayedErrorOverlay" />
          </div>
        );
      }

      return (
        <div className="environment-column">
          {this._renderErrorList(this.props.errors)}
        </div>
      );
    }

    return (
      <div className="environment-column">
        {this._renderPreview()}
        {this._renderRuntimeErrorList()}
      </div>
    );
  }
}

Output.propTypes = {
  project: React.PropTypes.object,
  hasErrors: React.PropTypes.bool.isRequired,
  errors: React.PropTypes.object.isRequired,
  runtimeErrors: React.PropTypes.array.isRequired,
  delayErrorDisplay: React.PropTypes.bool.isRequired,
  onErrorClicked: React.PropTypes.func.isRequired,
  onRuntimeError: React.PropTypes.func.isRequired,
  clearRuntimeErrors: React.PropTypes.func.isRequired,
};

export default Output;
