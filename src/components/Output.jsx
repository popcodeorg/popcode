import React from 'react';
import PropTypes from 'prop-types';
import {t} from 'i18next';
import isEmpty from 'lodash/isEmpty';
import isNull from 'lodash/isNull';
import classnames from 'classnames';
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
    if (isNull(this.props.project)) {
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
      return <div className="output__delayed-error-overlay" />;
    }

    if (this.props.validationState === 'failed') {
      return this._renderErrorList(this.props.errors);
    }

    return null;
  }

  render() {
    return (
      <div
        className={classnames(
          'environment__column',
          {u__hidden: this.props.isHidden},
        )}
      >
        <div className="environment__columnContents output">
          <div
            className="environment__label label"
            onClick={this.props.onHide}
          >
            {t('workspace.components.output')}
          </div>
          {this._renderErrors()}
          {this._renderPreview()}
          {this._renderRuntimeErrorList()}
        </div>
      </div>
    );
  }
}

Output.propTypes = {
  errors: PropTypes.object.isRequired,
  isHidden: PropTypes.bool.isRequired,
  project: PropTypes.object,
  runtimeErrors: PropTypes.array.isRequired,
  validationState: PropTypes.string.isRequired,
  onClearRuntimeErrors: PropTypes.func.isRequired,
  onErrorClick: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired,
  onRuntimeError: PropTypes.func.isRequired,
};

Output.defaultProps = {
  project: null,
};

export default Output;
