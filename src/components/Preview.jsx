import get from 'lodash-es/get';
import PropTypes from 'prop-types';
<<<<<<< HEAD
import ImmutablePropTypes from 'react-immutable-proptypes';
import React from 'react';
=======
import isNil from 'lodash/isNil';
import partial from 'lodash/partial';
import classnames from 'classnames';
import generatePreview, {generateTextPreview} from '../util/previewFrame';
import PreviewFrame from './PreviewFrame';

function generateFrameSrc(
  project,
  isSyntacticallyValid,
  lastRefreshTimestamp,
) {
  if (isNil(project) || !isSyntacticallyValid) {
    return '';
  }
>>>>>>> 23eb7f2... Updates to element highlighter

import PreviewFrame from './PreviewFrame';

export default function Preview({
<<<<<<< HEAD
<<<<<<< HEAD
=======
  focusedEditors,
  focusedSelector,
>>>>>>> 3cc1d22... Update selector at cursor and handle unfocused editor
  compiledProjects,
  consoleEntries,
  highlighterSelector,
  showingErrors,
  onConsoleError,
  onConsoleLog,
  onConsoleValue,
=======
  focusedEditors,
  focusedSelector,
  isSyntacticallyValid,
  lastRefreshTimestamp,
  project,
>>>>>>> 23eb7f2... Updates to element highlighter
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
      focusedEditors={focusedEditors}
      focusedSelector={focusedSelector}
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
<<<<<<< HEAD
      {projectFrames}
      // focusedSelector={focusedSelector}
=======
      <PreviewFrame
        focusedEditors={focusedEditors}
        focusedSelector={focusedSelector}
        src={
          generateFrameSrc(project, isSyntacticallyValid, lastRefreshTimestamp)
        }
        onRuntimeError={onRuntimeError}
      />
>>>>>>> 23eb7f2... Updates to element highlighter
    </div>
  );
}

Preview.propTypes = {
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
  compiledProjects: ImmutablePropTypes.iterable.isRequired,
  consoleEntries: ImmutablePropTypes.iterable.isRequired,
=======
  compiledProjects: ImmutablePropTypes.iterable.isRequired,
  consoleEntries: ImmutablePropTypes.iterable.isRequired,
  focusedEditors: PropTypes.array.isRequired,
>>>>>>> 3cc1d22... Update selector at cursor and handle unfocused editor
  focusedSelector: PropTypes.string,
  showingErrors: PropTypes.bool.isRequired,
  onConsoleError: PropTypes.func.isRequired,
  onConsoleLog: PropTypes.func.isRequired,
  onConsoleValue: PropTypes.func.isRequired,
=======
=======
  focusedEditors: PropTypes.array.isRequired,
>>>>>>> 23eb7f2... Updates to element highlighter
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
<<<<<<< HEAD
  highlighterSelector: '',
=======
  focusedSelector: null,
  lastRefreshTimestamp: null,
>>>>>>> 621d5f6... Add saga, add ref to iframe element
=======
  focusedSelector: null,
>>>>>>> 3cc1d22... Update selector at cursor and handle unfocused editor
};
