import React from 'react';
import PropTypes from 'prop-types';
import isNil from 'lodash/isNil';
import partial from 'lodash/partial';
import classnames from 'classnames';
import generatePreview, {generateTextPreview} from '../util/generatePreview';
import PreviewFrame from './PreviewFrame';

function generateFrameSrc(
  project,
  isSyntacticallyValid,
  lastRefreshTimestamp,
) {
  if (isNil(project) || !isSyntacticallyValid) {
    return '';
  }

  return generatePreview(
    project,
    {
      targetBaseTop: true,
      propagateErrorsToParent: true,
      breakLoops: true,
      nonBlockingAlertsAndPrompts: true,
      lastRefreshTimestamp,
    },
  );
}

export default function Preview({
  isSyntacticallyValid,
  lastRefreshTimestamp,
  project,
  onPopOutProject,
  onRefreshClick,
  onRuntimeError,
}) {
  return (
    <div
      className={classnames(
        'preview',
        'output__item',
        {u__hidden: !isSyntacticallyValid},
      )}
    >
      <div className="preview__title-bar">
        <span
          className="preview__button preview__button_pop-out u__icon"
          onClick={partial(onPopOutProject, project)}
        >&#xf08e;</span>
        {generateTextPreview(project)}
        <span
          className="preview__button preview__button_reset u__icon"
          onClick={onRefreshClick}
        >&#xf021;</span>
      </div>
      <PreviewFrame
        src={
          generateFrameSrc(project, isSyntacticallyValid, lastRefreshTimestamp)
        }
        onRuntimeError={onRuntimeError}
      />
    </div>
  );
}

Preview.propTypes = {
  isSyntacticallyValid: PropTypes.bool.isRequired,
  lastRefreshTimestamp: PropTypes.number,
  project: PropTypes.shape({
    sources: PropTypes.shape({
      html: PropTypes.string.isRequired,
      css: PropTypes.string.isRequired,
      javascript: PropTypes.string.isRequired,
    }).isRequired,
    enabledLibraries: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  onPopOutProject: PropTypes.func.isRequired,
  onRefreshClick: PropTypes.func.isRequired,
  onRuntimeError: PropTypes.func.isRequired,
};

Preview.defaultProps = {
  lastRefreshTimestamp: null,
};
