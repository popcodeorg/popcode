import React from 'react';
import PropTypes from 'prop-types';
import {ProjectPreview} from '../../containers';

function ProjectList({isOpen, projectKeys}) {
  if (!isOpen) {
    return null;
  }

  const projectPreviews = projectKeys.map(projectKey => (
    <ProjectPreview
      key={projectKey}
      projectKey={projectKey}
    />
  ));

  return (
    <div className="top-bar__menu">
      {projectPreviews}
    </div>
  );
}

ProjectList.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  projectKeys: PropTypes.array.isRequired,
};


export default ProjectList;
