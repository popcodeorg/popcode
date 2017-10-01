import get from 'lodash-es/get';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import React from 'react';

import PreviewFrame from './PreviewFrame';

export default function Preview({
  compiledProjects,
  consoleEntries,
  highlighterSelector,
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
      // focusedSelector={focusedSelector}
    </div>
  );
}

Preview.propTypes = {
<<<<<<< HEAD
  compiledProjects: ImmutablePropTypes.iterable.isRequired,
  consoleEntries: ImmutablePropTypes.iterable.isRequired,
  focusedSelector: PropTypes.string,
  showingErrors: PropTypes.bool.isRequired,
  onConsoleError: PropTypes.func.isRequired,
  onConsoleLog: PropTypes.func.isRequired,
  onConsoleValue: PropTypes.func.isRequired,
=======
  focusedSelector: PropTypes.string,
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
>>>>>>> 621d5f6... Add saga, add ref to iframe element
  onPopOutProject: PropTypes.func.isRequired,
  onRefreshClick: PropTypes.func.isRequired,
  onRuntimeError: PropTypes.func.isRequired,
};

Preview.defaultProps = {
<<<<<<< HEAD
  highlighterSelector: '',
=======
  focusedSelector: null,
  lastRefreshTimestamp: null,
>>>>>>> 621d5f6... Add saga, add ref to iframe element
};
