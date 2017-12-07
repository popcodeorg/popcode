import get from 'lodash/get';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import React from 'react';
import PreviewFrame from './PreviewFrame';

export default function Preview({
  compiledProjects,
  showingErrors,
  onPopOutProject,
  onRefreshClick,
  onRuntimeError,
}) {
  if (showingErrors) {
    return null;
  }

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
    <div className="preview output__item">
      <div className="preview__title-bar sub-bar">
        <div className="sub-bar__left">
          {title}
        </div>
        <div className="sub-bar__right">
          <span
            className="sub-bar__button"
            onClick={onPopOutProject}
          >Full screen</span>
          <span
            className="sub-bar__button"
            onClick={onRefreshClick}
          >Refresh</span>
        </div>
      </div>
      {projectFrames}
    </div>
  );
}

Preview.propTypes = {
  compiledProjects: ImmutablePropTypes.iterable.isRequired,
  showingErrors: PropTypes.bool.isRequired,
  onPopOutProject: PropTypes.func.isRequired,
  onRefreshClick: PropTypes.func.isRequired,
  onRuntimeError: PropTypes.func.isRequired,
};
