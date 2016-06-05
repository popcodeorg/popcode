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
        project={this.props.project}
        onClearRuntimeErrors={this.props.onClearRuntimeErrors}
        onRuntimeError={this.props.onRuntimeError}
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
          <div className="environment-column output">
            <div className="output-delayedErrorOverlay" />
          </div>
        );
      }

      return (
        <div className="environment-column output">
          {this._renderErrorList(this.props.errors)}
        </div>
      );
    }

    return (
      <div className="environment-column output">
        {this._renderPreview()}
        {this._renderRuntimeErrorList()}
      </div>
    );
  }
}

Output.propTypes = {
  delayErrorDisplay: React.PropTypes.bool.isRequired,
  errors: React.PropTypes.object.isRequired,
  hasErrors: React.PropTypes.bool.isRequired,
  project: React.PropTypes.object,
  runtimeErrors: React.PropTypes.array.isRequired,
  onClearRuntimeErrors: React.PropTypes.func.isRequired,
  onErrorClick: React.PropTypes.func.isRequired,
  onRuntimeError: React.PropTypes.func.isRequired,
};

export default Output;
