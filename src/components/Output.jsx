import React from 'react';
import PropTypes from 'prop-types';
import {t} from 'i18next';
import classnames from 'classnames';
import {ErrorReport, Preview} from '../containers';

const errorStates = new Set(['validation-error', 'runtime-error']);

class Output extends React.Component {
  _renderErrors() {
    if (this.props.validationState === 'validating') {
      return <div className="output__delayed-error-overlay" />;
    }

    if (errorStates.has(this.props.validationState)) {
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
          <Preview />
          {this._renderErrors()}
        </div>
      </div>
    );
  }
}

Output.propTypes = {
  isDraggingColumnDivider: PropTypes.bool.isRequired,
  isHidden: PropTypes.bool.isRequired,
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
