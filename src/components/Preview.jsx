import {
  faChevronDown,
  faExternalLinkAlt,
  faSyncAlt,
} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import classnames from 'classnames';
import partial from 'lodash-es/partial';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import React from 'react';

import PreviewFrame from './PreviewFrame';

export default function Preview({
  compiledProjects,
  consoleEntries,
  currentProjectKey,
  isOpen,
  showingErrors,
  title,
  onConsoleError,
  onConsoleLog,
  onConsoleValue,
  onPopOutProject,
  onRefreshClick,
  onRuntimeError,
  onToggleVisible,
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

  return (
    <div
      className={classnames('preview', 'output__item', {u__hidden: !isOpen})}
    >
      <div className="preview__title-bar">
        <span className="preview__button preview__button_pop-out">
          <FontAwesomeIcon icon={faExternalLinkAlt} onClick={onPopOutProject} />
        </span>
        {title}
        <span className="preview__button preview__button_toggle-visibility">
          <FontAwesomeIcon
            icon={faChevronDown}
            onClick={partial(onToggleVisible, currentProjectKey)}
          />
        </span>
        <span className="preview__button preview__button_reset">
          <FontAwesomeIcon icon={faSyncAlt} onClick={onRefreshClick} />
        </span>
      </div>
      {projectFrames}
    </div>
  );
}

Preview.propTypes = {
  compiledProjects: ImmutablePropTypes.iterable.isRequired,
  consoleEntries: ImmutablePropTypes.iterable.isRequired,
  currentProjectKey: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  showingErrors: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  onConsoleError: PropTypes.func.isRequired,
  onConsoleLog: PropTypes.func.isRequired,
  onConsoleValue: PropTypes.func.isRequired,
  onPopOutProject: PropTypes.func.isRequired,
  onRefreshClick: PropTypes.func.isRequired,
  onRuntimeError: PropTypes.func.isRequired,
  onToggleVisible: PropTypes.func.isRequired,
};
