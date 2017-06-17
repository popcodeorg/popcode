import React from 'react';
import PropTypes from 'prop-types';
import {generateTextPreview} from '../util/generatePreview';
import ProjectPreview from './ProjectPreview';

function ProjectList({currentProject, projects, onProjectSelected}) {
  const projectPreviews = projects.map(project => (
    <ProjectPreview
      isSelected={project.projectKey === currentProject.projectKey}
      key={project.projectKey}
      preview={generateTextPreview(project)}
      project={project}
      onProjectSelected={onProjectSelected}
    />
  ));

  return (
    <div className="dashboard__menu dashboard__menu_scrollable">
      {projectPreviews}
    </div>
  );
}

ProjectList.propTypes = {
  currentProject: PropTypes.object.isRequired,
  projects: PropTypes.array.isRequired,
  onProjectSelected: PropTypes.func.isRequired,
};


export default ProjectList;
