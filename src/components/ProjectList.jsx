var React = require('react');
var moment = require('moment');

var CurrentProjectActions = require('../actions/CurrentProjectActions');

var ProjectList = React.createClass({
  propTypes: {
    projects: React.PropTypes.array.isRequired,
    onProjectSelected: React.PropTypes.func.isRequired,
  },

  _onProjectClicked: function(project) {
    CurrentProjectActions.select(project.projectKey);
    this.props.onProjectSelected();
  },

  render: function() {
    var MAX_LENGTH = 50;
    var projects = this.props.projects.map(function(project) {
      return (
        <li className="toolbar-menu-item"
          onClick={this._onProjectClicked.bind(this, project)}
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
