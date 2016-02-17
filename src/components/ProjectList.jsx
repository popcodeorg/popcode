import React from 'react';
import moment from 'moment';

var ProjectList = React.createClass({
  propTypes: {
    projects: React.PropTypes.array.isRequired,
    onProjectSelected: React.PropTypes.func.isRequired,
  },

  render: function() {
    var MAX_LENGTH = 50;
    var projects = this.props.projects.map(function(project) {
      return (
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
      );
    }.bind(this));

    return <ul className="toolbar-menu">{projects}</ul>;
  },
});

module.exports = ProjectList;
