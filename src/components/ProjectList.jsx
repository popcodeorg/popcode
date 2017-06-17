import React from 'react';
import PropTypes from 'prop-types';
import {ProjectPreview} from '../containers';

function ProjectList({projectKeys}) {
  const projectPreviews = projectKeys.map(projectKey => (
    <ProjectPreview
      key={projectKey}
      projectKey={projectKey}
    />
  ));

  return (
    <div className="dashboard__menu dashboard__menu_scrollable">
      {projectPreviews}
    </div>
  );
}

ProjectList.propTypes = {
  projectKeys: PropTypes.array.isRequired,
};


export default ProjectList;
