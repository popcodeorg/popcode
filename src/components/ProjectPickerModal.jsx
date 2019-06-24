import classnames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import filter from 'lodash-es/filter';

import ProjectPreview from '../containers/ProjectPreview';

import Modal from './Modal';

export default function ProjectPickerModal({
  isOpen,
  projects,
  shouldShowArchivedProjects,
  onCloseProjectPickerModal,
}) {
  if (!isOpen) {
    return null;
  }

  const visibleProjects = shouldShowArchivedProjects
    ? filter(projects, ({isArchived}) => isArchived)
    : filter(projects, ({isArchived}) => !isArchived);

  return (
    <Modal>
      <div className="project-picker">
        <h1 className="assignment-creator__title">Projects</h1>
        <ul className="project-picker__nav">
          <li className="project-picker__nav-tab project-picker__nav-tab-active">
            My Projects
          </li>
          <li className="project-picker__nav-tab">Archived</li>
        </ul>
        <div className="project-picker__list">
          {visibleProjects.map(item => {
            return (
              <ProjectPreview
                key={item.projectKey}
                projectKey={item.projectKey}
              />
            );
          })}
        </div>
        <div className="account-migration__buttons">
          <button
            className={classnames(
              'account-migration__button',
              'account-migration__button_cancel',
            )}
            onClick={onCloseProjectPickerModal}
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}

ProjectPickerModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  projects: PropTypes.array.isRequired,
  shouldShowArchivedProjects: PropTypes.bool.isRequired,
  onCloseProjectPickerModal: PropTypes.func.isRequired,
  onToggleViewArchived: PropTypes.func.isRequired,
};
