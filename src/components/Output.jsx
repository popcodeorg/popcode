import React from 'react';
import PropTypes from 'prop-types';
import {t} from 'i18next';
import classnames from 'classnames';
import {ErrorReport, Preview} from '../containers';

class Output extends React.Component {
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
          <ErrorReport />
        </div>
      </div>
    );
  }
}

Output.propTypes = {
  isDraggingColumnDivider: PropTypes.bool.isRequired,
  isHidden: PropTypes.bool.isRequired,
  style: PropTypes.object.isRequired,
  onHide: PropTypes.func.isRequired,
  onRef: PropTypes.func.isRequired,
};

Output.defaultProps = {
  lastRefreshTimestamp: null,
  project: null,
};

export default Output;
