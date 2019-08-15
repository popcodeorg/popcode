import {faArchive} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import classnames from 'classnames';
import i18next from 'i18next';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';

const MAX_LENGTH = 50;

export default function ProjectPreview({
  isCurrentProject,
  preview,
  project,
  onProjectArchived,
  onProjectSelected,
}) {
  return (
    <div className="project-preview" onClick={onProjectSelected}>
      <div className="project-preview__label">
        {preview.slice(0, MAX_LENGTH)}
        {project.updatedAt && (
          <div className="project-preview__timestamp">
            {moment(project.updatedAt).fromNow()}
          </div>
        )}
      </div>
      {(function showArchived() {
        if (isCurrentProject) {
          return (
            <div className="project-preview__status">
              {t('project-preview.current-project')}
            </div>
          );
        }
        if (project.isArchived) {
          return (
            <div className="project-preview__status">
              {t('project-preview.project-archived')}
            </div>
          );
        }
        return (
          <div
            className="project-preview__archive"
            onClick={e => {
              e.stopPropagation();
              onProjectArchived();
            }}
          >
            <span className="project-preview__archive-tooltip">Archive</span>
            <FontAwesomeIcon icon={faArchive} />
          </div>
        );
      })()}
    </div>
  );
}

ProjectPreview.propTypes = {
  isCurrentProject: PropTypes.bool.isRequired,
  preview: PropTypes.string.isRequired,
  project: PropTypes.object.isRequired,
  onProjectArchived: PropTypes.func.isRequired,
  onProjectSelected: PropTypes.func.isRequired,
};
