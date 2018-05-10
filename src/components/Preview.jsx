import get from 'lodash-es/get';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import React from 'react';
import PreviewFrame from './PreviewFrame';

export default function Preview({
  compiledProjects,
  consoleEntries,
  showingErrors,
  onConsoleError,
  onConsoleLog,
  onConsoleValue,
  onPopOutProject,
  onRefreshClick,
  onRuntimeError,
}) {
  if (showingErrors) {
    return null;
  }

  const projectFrames = compiledProjects.map((compiledProject, key) => (
    <PreviewFrame
      compiledProject={compiledProject}
      consoleEntries={consoleEntries}
      isActive={key === compiledProjects.keySeq().last()}
      key={compiledProject.compiledProjectKey}
      onConsoleError={onConsoleError}
      onConsoleLog={onConsoleLog}
      onConsoleValue={onConsoleValue}
      onRuntimeError={onRuntimeError}
    />
  ));

  const mostRecentCompiledProject = compiledProjects.last();
  const title = get(mostRecentCompiledProject, 'title', '');

  return (
    <div className="preview output__item">
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
  consoleEntries: ImmutablePropTypes.iterable.isRequired,
  showingErrors: PropTypes.bool.isRequired,
  onConsoleError: PropTypes.func.isRequired,
  onConsoleLog: PropTypes.func.isRequired,
  onConsoleValue: PropTypes.func.isRequired,
  onPopOutProject: PropTypes.func.isRequired,
  onRefreshClick: PropTypes.func.isRequired,
  onRuntimeError: PropTypes.func.isRequired,
};
