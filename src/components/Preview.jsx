import React from 'react';
import PropTypes from 'prop-types';
import isNil from 'lodash/isNil';
import partial from 'lodash/partial';
import classnames from 'classnames';
import generatePreview from '../util/generatePreview';
import PreviewFrame from './PreviewFrame';

function generateDocument(project, lastRefreshTimestamp) {
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
  isValid,
  lastRefreshTimestamp,
  project,
  onClearRuntimeErrors,
  onPopOutProject,
  onRefreshClick,
  onRuntimeError,
}) {
  const preview = isNil(project) || !isValid ?
    '' :
    generateDocument(project, lastRefreshTimestamp);

  return (
    <div
      className={classnames(
        'preview',
        'output__item',
        {u__hidden: !isValid},
      )}
    >
      <span
        className="preview__button preview__button_reset"
        onClick={onRefreshClick}
      >&#xf021;</span>
      <span
        className="preview__button preview__button_pop-out"
        onClick={partial(onPopOutProject, project)}
      >&#xf08e;</span>
      <PreviewFrame
        src={preview}
        onFrameWillRefresh={onClearRuntimeErrors}
        onRuntimeError={onRuntimeError}
      />
    </div>
  );
}

Preview.propTypes = {
  isValid: PropTypes.bool.isRequired,
  lastRefreshTimestamp: PropTypes.number,
  project: PropTypes.shape({
    sources: PropTypes.shape({
      html: PropTypes.string.isRequired,
      css: PropTypes.string.isRequired,
      javascript: PropTypes.string.isRequired,
    }).isRequired,
    enabledLibraries: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  onClearRuntimeErrors: PropTypes.func.isRequired,
  onPopOutProject: PropTypes.func.isRequired,
  onRefreshClick: PropTypes.func.isRequired,
  onRuntimeError: PropTypes.func.isRequired,
};

Preview.defaultProps = {
  lastRefreshTimestamp: null,
};
