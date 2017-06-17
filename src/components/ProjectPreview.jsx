import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import moment from 'moment';
import partial from 'lodash/partial';

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
        'dashboard__menu-item',
        {'dashboard__menu-item_active': isSelected},
      )}
      key={project.projectKey}
      onClick={partial(onProjectSelected, project)}
    >
      <div className="project-preview__timestamp">
        {moment(project.updatedAt).fromNow()}
      </div>
      <div>
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
