import React from 'react';
import isEmpty from 'lodash/isEmpty';
import ErrorList from './ErrorList';
import Preview from './Preview';

class Output extends React.Component {
  _renderErrorList(props) {
    return (
      <ErrorList
        {...props}
        onErrorClick={this.props.onErrorClick}
      />
    );
  }

  _renderPreview() {
    if (!this.props.project) {
      return null;
    }

    return (
      <Preview
        isValid={this.props.validationState === 'passed'}
        project={this.props.project}
        onClearRuntimeErrors={this.props.onClearRuntimeErrors}
        onRuntimeError={this.props.onRuntimeError}
      />
    );
  }

  _renderRuntimeErrorList() {
    if (!isEmpty(this.props.runtimeErrors)) {
      return this._renderErrorList({
        html: {items: [], state: 'passed'},
        css: {items: [], state: 'passed'},
        javascript: {
          items: this.props.runtimeErrors,
          state: this.props.runtimeErrors.length ? 'failed' : 'passed',
        },
        docked: true,
      });
    }

    return null;
  }

  _renderErrors() {
    if (this.props.validationState === 'validating') {
      return <div className="output-delayedErrorOverlay" />;
    }

    if (this.props.validationState === 'failed') {
      return this._renderErrorList(this.props.errors);
    }

    return null;
  }

  render() {
    return (
      <div className="environment-column output">
        {this._renderErrors()}
        {this._renderPreview()}
        {this._renderRuntimeErrorList()}
      </div>
    );
  }
}

Output.propTypes = {
  errors: React.PropTypes.object.isRequired,
  project: React.PropTypes.object,
  runtimeErrors: React.PropTypes.array.isRequired,
  validationState: React.PropTypes.string,
  onClearRuntimeErrors: React.PropTypes.func.isRequired,
  onErrorClick: React.PropTypes.func.isRequired,
  onRuntimeError: React.PropTypes.func.isRequired,
};

export default Output;
