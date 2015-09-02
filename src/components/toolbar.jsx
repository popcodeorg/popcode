"use strict";

var React = require('react');
var i18n = require('i18next-client');
var _ = require('lodash');

var config = require('../config');

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

  _newProject: function() {
    this.setState({open: false});
    this.props.onNewProject();
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

module.exports = Toolbar;
