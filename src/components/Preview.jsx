import classnames from 'classnames';
import get from 'lodash/get';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import React from 'react';
import PreviewFrame from './PreviewFrame';

export default function Preview({
  compiledProjects,
  onPopOutProject,
  onRefreshClick,
  onRuntimeError,
}) {
  const projectFrames = compiledProjects.map(({source, timestamp}) => (
    <PreviewFrame
      key={timestamp}
      src={source}
      onRuntimeError={onRuntimeError}
    />
  ));

  const mostRecentCompiledProject = compiledProjects.last();
  const title = get(mostRecentCompiledProject, 'title', '');

  return (
    <div
      className={classnames(
        'preview',
        'output__item',
      )}
    >
      <div className="preview__title-bar">
        <span
          className="preview__button preview__button_pop-out u__icon"
          onClick={onPopOutProject}
        >&#xf08e;</span>
        {title}
        <span
          className="preview__button preview__button_reset u__icon"
          onClick={onRefreshClick}
        >&#xf021;</span>
      </div>
      {projectFrames}
    </div>
  );
}

Preview.propTypes = {
  compiledProjects: ImmutablePropTypes.iterable.isRequired,
  onPopOutProject: PropTypes.func.isRequired,
  onRefreshClick: PropTypes.func.isRequired,
  onRuntimeError: PropTypes.func.isRequired,
};
