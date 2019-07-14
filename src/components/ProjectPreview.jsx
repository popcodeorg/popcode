import {faArchive} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import classnames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import {t} from 'i18next';

const MAX_LENGTH = 50;

export default function ProjectPreview({
  isCurrentProject,
  preview,
  project,
  onProjectArchived,
}) {
  return (
    <div>
      <div className="project-preview">
        <div
          className={classnames('project-preview__label', {
            'project-preview__label_archived': project.isArchived,
          })}
        >
          {preview.slice(0, MAX_LENGTH)}
        </div>
        {(function showArchived() {
          if (isCurrentProject) {
            return null;
          }
          if (project.isArchived) {
            return (
              <div className="project-preview__archived">
                {t('top-bar.project-archived')}
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
              <FontAwesomeIcon icon={faArchive} />
            </div>
          );
        })()}
      </div>
      {project.updatedAt && (
        <div className="project-preview__timestamp">
          {moment(project.updatedAt).fromNow()}
        </div>
      )}
    </div>
  );
}

ProjectPreview.propTypes = {
  isCurrentProject: PropTypes.bool.isRequired,
  preview: PropTypes.string.isRequired,
  project: PropTypes.object.isRequired,
  onProjectArchived: PropTypes.func.isRequired,
};
