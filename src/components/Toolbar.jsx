"use strict";

var React = require('react');
var i18n = require('i18next-client');
var _ = require('lodash');
var moment = require('moment');

var config = require('../config');
var Storage = require('../services/Storage');

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
    this.props.onNewProject();
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
        return <LibraryPicker
          enabledLibraries={this.props.enabledLibraries}
          onLibraryToggled={this.props.onLibraryToggled} />;
      case 'loadProject':
        return <ProjectList onProjectSelected={this._onProjectSelected} />;
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
  },

  _onProjectSelected: function(project) {
    this._close();
    this.props.onProjectSelected(project);
  }
});

var LibraryPicker = React.createClass({
  render: function() {
    var libraries = _.map(config.libraries, function(library, key) {
      var classNames = ['toolbar-menu-item'];
      if (this.props.enabledLibraries.indexOf(key) !== -1) {
        classNames.push('toolbar-menu-item--active');
      }
      return <li
        className={classNames.join(' ')}
        onClick={this._onLibraryClicked.bind(this, key)}>

        {library.name}
      </li>;
    }.bind(this));
    return <ul className="toolbar-menu">{libraries}</ul>;
  },

  _onLibraryClicked: function(libraryKey) {
    this.props.onLibraryToggled(libraryKey);
  }
});

var ProjectList = React.createClass({
  getInitialState: function() {
    return {projects: []};
  },

  componentDidMount: function() {
    Storage.all().then(function(projects) {
      this.setState({projects: projects});
    }.bind(this));
  },

  render: function() {
    var projects = this.state.projects.map(function(project) {
      return (
        <li className='toolbar-menu-item'
          onClick={this.props.onProjectSelected.bind(this, project)}>
          <div>{moment(project.updatedAt).fromNow()}</div>
          <div><code>{project.data.sources.html.slice(0, 50)}</code></div>
          <div><code>{project.data.sources.css.slice(0, 50)}</code></div>
          <div>
            <code>{project.data.sources.javascript.slice(0, 50)}</code>
          </div>
        </li>
      );
    }.bind(this));

    return <ul className="toolbar-menu">{projects}</ul>;
  }
});

module.exports = Toolbar;
