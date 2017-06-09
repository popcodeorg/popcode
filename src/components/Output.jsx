import React from 'react';
import PropTypes from 'prop-types';
import {t} from 'i18next';
import isEmpty from 'lodash/isEmpty';
import classnames from 'classnames';
import {ErrorReport, Preview} from '../containers';

class Output extends React.Component {
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
      return <ErrorReport />;
    }

    return null;
  }

  render() {
    const {
      isDraggingColumnDivider,
      isHidden,
      style,
      onHide,
      onRef,
    } = this.props;
    return (
      <div
        className={classnames(
          'environment__column',
          {u__hidden: isHidden},
        )}
        ref={onRef}
        style={Object.assign({}, style, {
          pointerEvents: isDraggingColumnDivider ? 'none' : 'all',
        })}
      >
        <div className="environment__columnContents output">
          <div
            className="environment__label label"
            onClick={onHide}
          >
            {t('workspace.components.output')}
          </div>
          {this._renderErrors()}
          <Preview />
          {this._renderRuntimeErrorList()}
        </div>
      </div>
    );
  }
}

Output.propTypes = {
  isDraggingColumnDivider: PropTypes.bool.isRequired,
  isHidden: PropTypes.bool.isRequired,
  runtimeErrors: PropTypes.array.isRequired,
  style: PropTypes.object.isRequired,
  validationState: PropTypes.string.isRequired,
  onHide: PropTypes.func.isRequired,
  onRef: PropTypes.func.isRequired,
};

Output.defaultProps = {
  lastRefreshTimestamp: null,
  project: null,
};

export default Output;
