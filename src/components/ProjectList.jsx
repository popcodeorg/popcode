import React from 'react';
import moment from 'moment';

class ProjectList extends React.Component {
  render() {
    const MAX_LENGTH = 50;
    const projects = this.props.projects.map((project) => (
      <li className="toolbar-menu-item"
        onClick={this.props.onProjectSelected.bind(null, project)}
      >
        <div>{moment(project.updatedAt).fromNow()}</div>
        <div><code>{project.sources.html.slice(0, MAX_LENGTH)}</code></div>
        <div><code>{project.sources.css.slice(0, MAX_LENGTH)}</code></div>
        <div>
          <code>{project.sources.javascript.slice(0, MAX_LENGTH)}</code>
        </div>
      </li>
    ));

    return <ul className="toolbar-menu">{projects}</ul>;
  }
}

ProjectList.propTypes = {
  projects: React.PropTypes.array.isRequired,
  onProjectSelected: React.PropTypes.func.isRequired,
};


export default ProjectList;
