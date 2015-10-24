var React = require('react');
var moment = require('moment');

var CurrentProjectActions = require('../actions/CurrentProjectActions');
var ProjectStore = require('../stores/ProjectStore');

function calculateState() {
  return {projects: ProjectStore.all()};
}

var ProjectList = React.createClass({
  propTypes: {
    onProjectSelected: React.PropTypes.func.isRequired,
  },

  getInitialState: function() {
    return calculateState();
  },

  componentDidMount: function() {
    ProjectStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    ProjectStore.removeChangeListener(this._onChange);
  },

  render: function() {
    var MAX_LENGTH = 50;
    var projects = this.state.projects.map(function(project) {
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

  _onChange: function() {
    this.setState(calculateState());
  },

  _onProjectClicked: function(project) {
    CurrentProjectActions.select(project.projectKey);
    this.props.onProjectSelected();
  },
});

module.exports = ProjectList;
