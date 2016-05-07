import React from 'react';
import moment from 'moment';
import classnames from 'classnames';
import {generateTextPreview} from '../util/generatePreview';

const MAX_LENGTH = 50;

class ProjectList extends React.Component {
  render() {
    const projects = this.props.projects.map((project) => {
      const preview = generateTextPreview(project);
      const isSelected =
        project.projectKey === this.props.currentProject.projectKey;

      return (
        <div
          key={project.projectKey}
          className={classnames(
            'projectPreview',
            'dashboard-menu-item',
            {'dashboard-menu-item--active': isSelected}
          )}
          onClick={this.props.onProjectSelected.bind(null, project)}
        >
          <div className="projectPreview-timestamp">
            {moment(project.updatedAt).fromNow()}
          </div>
          <div className="projectPreview-previewText">
            {preview.slice(0, MAX_LENGTH)}
          </div>
        </div>
      );
    });

    return (
      <div className="dashboard-menu dashboard-menu--scrollable">
        {projects}
      </div>
    );
  }
}

ProjectList.propTypes = {
  projects: React.PropTypes.array.isRequired,
  currentProject: React.PropTypes.object.isRequired,
  onProjectSelected: React.PropTypes.func.isRequired,
};


export default ProjectList;
