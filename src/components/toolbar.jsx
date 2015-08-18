"use strict";

var React = require('react');
var i18n = require('i18next-client');

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
        <div className="toolbar-showHide" onClick={this._toggleShowHideState}>
          {this._showHideLabel()}
        </div>
        <ul className={toolbarItemsClasses.join(' ')}>
          <li className='toolbar-items-item'>Add Library</li>
        </ul>
      </div>
    );
  },

  _showHideLabel() {
    if (this.state.open) {
      return i18n.t("toolbar.hide");
    } else {
      return i18n.t("toolbar.show");
    }
  },

  _toggleShowHideState() {
    this.setState({open: !this.state.open});
  }
});

module.exports = Toolbar;
