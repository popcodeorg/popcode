import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import moment from 'moment';

const MAX_LENGTH = 50;

export default function ProjectPreview({
  isSelected,
  preview,
  project,
  onProjectSelected,
}) {
  return (
    <div
      className={classnames(
        'project-preview',
        'top-bar__menu-item',
        {'top-bar__menu-item_active': isSelected},
      )}
      key={project.projectKey}
      onClick={onProjectSelected}
    >
      <div className="project-preview__timestamp">
        {moment(project.updatedAt).fromNow()}
      </div>
      <div className="project-preview__label">
        {preview.slice(0, MAX_LENGTH)}
      </div>
    </div>
  );
}

ProjectPreview.propTypes = {
  isSelected: PropTypes.bool.isRequired,
  preview: PropTypes.string.isRequired,
  project: PropTypes.object.isRequired,
  onProjectSelected: PropTypes.func.isRequired,
};
