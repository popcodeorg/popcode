import {faTimesCircle} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import classnames from 'classnames';
import i18next from 'i18next';
import isEmpty from 'lodash-es/isEmpty';
import partial from 'lodash-es/partial';
import PropTypes from 'prop-types';
import React from 'react';

import ProjectPreview from '../containers/ProjectPreview';

import Modal from './Modal';

export default function ProjectPickerModal({
  isOpen,
  activeProjects,
  archivedProjects,
  projectsFilter,
  onCloseProjectPickerModal,
  onFilterProjects,
}) {
  if (!isOpen) {
    return null;
  }
  const visibleProjects =
    projectsFilter === 'archived' ? archivedProjects : activeProjects;
  return (
    <Modal onClose={onCloseProjectPickerModal}>
      <div className="project-picker">
        <h1 className="modal__header">{i18next.t('project-picker.title')}</h1>
        <ul className="project-picker__nav">
          <li
            className={classnames('project-picker__nav-tab', {
              'project-picker__nav-tab-active': projectsFilter === 'active',
            })}
            onClick={partial(onFilterProjects, 'active')}
          >
            {i18next.t('project-picker.tabs.active')}
          </li>
          {!isEmpty(archivedProjects) && (
            <li
              className={classnames('project-picker__nav-tab', {
                'project-picker__nav-tab-active': projectsFilter === 'archived',
              })}
              onClick={partial(onFilterProjects, 'archived')}
            >
              {i18next.t('project-picker.tabs.archived')}
            </li>
          )}
        </ul>
        <div className="project-picker__list">
          {visibleProjects.map(({projectKey}) => (
            <ProjectPreview key={projectKey} projectKey={projectKey} />
          ))}
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
  activeProjects: PropTypes.array.isRequired,
  archivedProjects: PropTypes.array.isRequired,
  isOpen: PropTypes.bool.isRequired,
  projectsFilter: PropTypes.string.isRequired,
  onCloseProjectPickerModal: PropTypes.func.isRequired,
  onFilterProjects: PropTypes.func.isRequired,
};
