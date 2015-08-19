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
    var toolbarItemsClasses = ['toolbar-items'];
    if (this.state.open) {
      toolbarItemsClasses.push('toolbar-items--open');
    } else {
      toolbarItemsClasses.push('toolbar-items--closed');
    }

    return (
      <div className="toolbar">
        <div
          className="toolbar-showHide"
          onClick={this._toggleShowHideState}>

          {this._showHideLabel()}
        </div>
        <ul className={toolbarItemsClasses.join(' ')}>
          <li className='toolbar-items-item'
            onClick={this._showLibraryPicker}>

            Libraries
          </li>
        </ul>
        {this._getSubmenu()}
      </div>
    );
  },

  _showHideLabel: function() {
    if (this.state.open) {
      return i18n.t("toolbar.hide");
    } else {
      return i18n.t("toolbar.show");
    }
  },

  _showLibraryPicker: function() {
    return this.setState({submenu: 'libraries'});
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
    this.setState({open: !this.state.open});
  }
});

var LibraryPicker = React.createClass({
  render: function() {
    var libraries = _.map(config.libraries, function(library) {
      var classNames = ['toolbar-libraryPicker-library'];
      if (this.props.enabledLibraries.indexOf(library) !== -1) {
        classNames.push('toolbar-libraryPicker-library--enabled');
      }
      return <li
        className={classNames.join(' ')}
        onClick={this._onLibraryClicked.bind(this, library)}>

        {library.name}
      </li>;
    }.bind(this));
    return <ul className="toolbar-libraryPicker">{libraries}</ul>;
  },

  _onLibraryClicked: function(library) {
    this.props.onLibraryToggled(library);
  }
});

module.exports = Toolbar;
