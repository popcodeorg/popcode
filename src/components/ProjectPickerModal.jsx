import classnames from 'classnames';
import {faTimesCircle} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import React from 'react';
import PropTypes from 'prop-types';
import filter from 'lodash-es/filter';
import partial from 'lodash-es/partial';
import {t} from 'i18next';
import isEmpty from 'lodash-es/isEmpty';

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
  const activeProjects = filter(projects, ({isArchived}) => !isArchived);
  const archivedProjects = filter(projects, ({isArchived}) => isArchived);
  if (projectsFilter === 'active') {
    visibleProjects = activeProjects;
  } else if (projectsFilter === 'archived') {
    visibleProjects = archivedProjects;
  }

  return (
    <Modal onClose={onCloseProjectPickerModal}>
      <div className="project-picker">
        <h1 className="assignment-creator__title">
          {t('project-picker.title')}
        </h1>
        <ul className="project-picker__nav">
          <li
            className={classnames('project-picker__nav-tab', {
              'project-picker__nav-tab-active': projectsFilter === 'active',
            })}
            onClick={partial(onFilterProjects, 'active')}
          >
            {t('project-picker.tabs.active')}
          </li>
          {isEmpty(archivedProjects) ? null : (
            <li
              className={classnames('project-picker__nav-tab', {
                'project-picker__nav-tab-active': projectsFilter === 'archived',
              })}
              onClick={partial(onFilterProjects, 'archived')}
            >
              {t('project-picker.tabs.archived')}
            </li>
          )}
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
        <div
          className="project-picker__close"
          onClick={onCloseProjectPickerModal}
        >
          <FontAwesomeIcon icon={faTimesCircle} />
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
