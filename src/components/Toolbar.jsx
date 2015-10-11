"use strict";

var React = require('react');
var cx = React.addons.classSet;
var i18n = require('i18next-client');
var _ = require('lodash');
var moment = require('moment');

var config = require('../config');
var ProjectStore = require('../stores/ProjectStore');
var ProjectActions = require('../actions/ProjectActions');
var CurrentProjectActions = require('../actions/CurrentProjectActions');

var Toolbar = React.createClass({
  getInitialState: function() {
    return {open: false};
  },

  render: function() {
    var toolbarItemsClasses = ['toolbar-menu'];
    if (this.state.open) {
      toolbarItemsClasses.push('toolbar-menu--open');
    } else {
      toolbarItemsClasses.push('toolbar-menu--closed');
    }

    return (
      <div className="toolbar">
        <div
          className="toolbar-showHide"
          onClick={this._toggleShowHideState}>

          {this._showHideLabel()}
        </div>
        <ul className={toolbarItemsClasses.join(' ')}>
          <li onClick={this._newProject}
            className='toolbar-menu-item'>{i18n.t('toolbar.new-project')}</li>
          <li onClick={this._loadProject}
            className={this.state.submenu === 'loadProject' ?
              'toolbar-menu-item toolbar-menu-item--active' :
              'toolbar-menu-item'}>
            {i18n.t('toolbar.load-project')}
          </li>
          <li onClick={this._toggleLibraryPicker}
            className={this.state.submenu === 'libraries' ?
              'toolbar-menu-item toolbar-menu-item--active' :
              'toolbar-menu-item'}>
            {i18n.t('toolbar.libraries')}
          </li>
        </ul>
        {this._getSubmenu()}
      </div>
    );
  },

  _close: function() {
    this.setState({open: false, submenu: null});
  },

  _newProject: function() {
    this._close();
    ProjectActions.create();
  },

  _loadProject: function() {
    this.setState({submenu: 'loadProject'});
  },

  _showHideLabel: function() {
    if (this.state.open) {
      return i18n.t("toolbar.hide");
    } else {
      return i18n.t("toolbar.show");
    }
  },

  _toggleLibraryPicker: function() {
    return this.setState(function(oldState) {
      if (oldState.submenu === 'libraries') {
        return {submenu: null};
      } else {
        return {submenu: 'libraries'};
      }
    });
  },

  _getSubmenu: function() {
    switch(this.state.submenu) {
      case 'libraries':
        return <LibraryPicker projectKey={this.props.projectKey} />;
      case 'loadProject':
        return <ProjectList onProjectSelected={this._close} />;
    }
  },

  _toggleShowHideState: function() {
    this.setState(function(oldState) {
      if (oldState.open) {
        return {open: false, submenu: null};
      } else {
        return {open: true};
      }
    });
  }
});

var LibraryPicker = React.createClass({
  getInitialState: function() {
    return this._calculateState();
  },

  componentDidMount: function() {
    ProjectStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    ProjectStore.removeChangeListener(this._onChange);
  },

  render: function() {
    var libraries = _.map(config.libraries, function(library, key) {
      return (
        <LibraryPickerItem
          projectKey={this.props.projectKey}
          libraryKey={key}
          enabled={this._isLibraryEnabled(key)} />
      );
    }.bind(this));

    return <ul className="toolbar-menu">{libraries}</ul>;
  },

  _onChange: function() {
    this.setState(this._calculateState());
  },

  _calculateState: function() {
    var enabledLibraries = [];
    if (this.props.projectKey) {
      enabledLibraries =
        ProjectStore.get(this.props.projectKey).enabledLibraries;
    }
    return {enabledLibraries: enabledLibraries};
  },

  _isLibraryEnabled: function(libraryKey) {
    return this.state.enabledLibraries.indexOf(libraryKey) !== -1;
  }
});

var LibraryPickerItem = React.createClass({
  render: function() {
    var library = this._getLibrary();
    return (
      <li className={cx({
        'toolbar-menu-item': true,
        'toolbar-menu-item--active': this.props.enabled
      })} onClick={this._onClicked}>

        {library.name}
      </li>
    );
  },

  _getLibrary: function() {
    return config.libraries[this.props.libraryKey];
  },

  _onClicked: function() {
    ProjectActions.toggleLibrary(this.props.projectKey, this.props.libraryKey);
  }
});

var ProjectList = React.createClass({
  getInitialState: function() {
    return this._calculateState();
  },

  componentDidMount: function() {
    ProjectStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    ProjectStore.removeChangeListener(this._onChange);
  },

  render: function() {
    var projects = this.state.projects.map(function(project) {
      return (
        <li className='toolbar-menu-item'
          onClick={this._onProjectClicked.bind(this, project)}>
          <div>{moment(project.updatedAt).fromNow()}</div>
          <div><code>{project.sources.html.slice(0, 50)}</code></div>
          <div><code>{project.sources.css.slice(0, 50)}</code></div>
          <div>
            <code>{project.sources.javascript.slice(0, 50)}</code>
          </div>
        </li>
      );
    }.bind(this));

    return <ul className="toolbar-menu">{projects}</ul>;
  },

  _onChange: function() {
    this.setState(this._calculateState());
  },

  _calculateState: function() {
    return {projects: ProjectStore.all()};
  },

  _onProjectClicked: function(project) {
    CurrentProjectActions.select(project.projectKey);
    this.props.onProjectSelected();
  }
});

module.exports = Toolbar;
