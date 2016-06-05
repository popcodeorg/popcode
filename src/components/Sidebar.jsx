import React from 'react';
import i18n from 'i18next-client';
import classnames from 'classnames';
import Isvg from 'react-inlinesvg';
import partial from 'lodash/partial';

class Sidebar extends React.Component {
  _renderMinimizedComponents() {
    const components = this.props.minimizedComponents.
      map((componentName) => (
        <div
          className="sidebar-minimizedComponent"
          key={componentName}
          onClick={partial(this.props.onComponentMaximized, componentName)}
        >
          {i18n.t(`workspace.components.${componentName}`)}
        </div>
      ));

    return (
      <div className="sidebar-minimizedComponents">
        {components}
      </div>
    );
  }

  render() {
    return (
      <div className="sidebar">
        <div className="sidebar-wordmarkContainer">
          <Isvg src="/images/wordmark-vertical.svg" />
          <div
            className={classnames(
              'sidebar-arrow',
              {
                'sidebar-arrow--show': !this.props.dashboardIsOpen,
                'sidebar-arrow--hide': this.props.dashboardIsOpen,
              }
            )}
            onClick={this.props.onToggleDashboard}
          />
        </div>
        {this._renderMinimizedComponents()}
      </div>
    );
  }
}

Sidebar.propTypes = {
  dashboardIsOpen: React.PropTypes.bool.isRequired,
  minimizedComponents: React.PropTypes.array.isRequired,
  onComponentMaximized: React.PropTypes.func.isRequired,
  onToggleDashboard: React.PropTypes.func.isRequired,
};

export default Sidebar;
