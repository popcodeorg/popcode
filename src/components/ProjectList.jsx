import React from 'react';
import moment from 'moment';
import classnames from 'classnames';
import partial from 'lodash/partial';
import {generateTextPreview} from '../util/generatePreview';

const MAX_LENGTH = 50;

function ProjectList(props) {
  const projects = props.projects.map((project) => {
    const preview = generateTextPreview(project);
    const isSelected =
      project.projectKey === props.currentProject.projectKey;

    return (
      <div
        className={classnames(
          'project-preview',
          'dashboard__menu-item',
          {'dashboard__menu-item_active': isSelected}
        )}
        key={project.projectKey}
        onClick={partial(props.onProjectSelected, project)}
      >
        <div className="project-preview__timestamp">
          {moment(project.updatedAt).fromNow()}
        </div>
        <div>
          {preview.slice(0, MAX_LENGTH)}
        </div>
      </div>
    );
  });

  return (
    <div className="dashboard__menu dashboard__menu_scrollable">
      {projects}
    </div>
  );
}

ProjectList.propTypes = {
  currentProject: React.PropTypes.object.isRequired,
  projects: React.PropTypes.array.isRequired,
  onProjectSelected: React.PropTypes.func.isRequired,
};


export default ProjectList;
