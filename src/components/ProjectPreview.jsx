import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

const MAX_LENGTH = 50;

export default function ProjectPreview({preview, project}) {
  const projectTimestamp = project.updatedAt ?
    (
      <div className="project-preview__timestamp">
        {moment(project.updatedAt).fromNow()}
      </div>
    ) : null;

  return (
    <div>
      <div className="project-preview__label">
        {preview.slice(0, MAX_LENGTH)}
      </div>
      {projectTimestamp}
    </div>
  );
}

ProjectPreview.propTypes = {
  preview: PropTypes.string.isRequired,
  project: PropTypes.object.isRequired,
};
