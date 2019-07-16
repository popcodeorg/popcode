import classnames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import filter from 'lodash-es/filter';
import partial from 'lodash-es/partial';

import ProjectPreview from '../containers/ProjectPreview';

import Modal from './Modal';

export default function ProjectPickerModal({
  isOpen,
  projects,
  projectsFilter,
  onCloseProjectPickerModal,
  onFilterProjects,
}) {
  if (!isOpen) {
    return null;
  }

  let visibleProjects;
  if (projectsFilter === 'active') {
    visibleProjects = filter(projects, ({isArchived}) => !isArchived);
  } else if (projectsFilter === 'archived') {
    visibleProjects = filter(projects, ({isArchived}) => isArchived);
  }

  return (
    <Modal>
      <div className="project-picker">
        <h1 className="assignment-creator__title">My Projects</h1>
        <ul className="project-picker__nav">
          <li
            className={classnames('project-picker__nav-tab', {
              'project-picker__nav-tab-active': projectsFilter === 'active',
            })}
            onClick={partial(onFilterProjects, 'active')}
          >
            Active
          </li>
          <li
            className={classnames('project-picker__nav-tab', {
              'project-picker__nav-tab-active': projectsFilter === 'archived',
            })}
            onClick={partial(onFilterProjects, 'archived')}
          >
            Archived
          </li>
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
  projectsFilter: PropTypes.string.isRequired,
  onCloseProjectPickerModal: PropTypes.func.isRequired,
  onFilterProjects: PropTypes.func.isRequired,
};
