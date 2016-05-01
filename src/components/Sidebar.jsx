import React from 'react';
import i18n from 'i18next-client';
import partial from 'lodash/partial';
import {WordmarkVertical} from '../util/SVG';

class Sidebar extends React.Component {
  _renderMinimizedComponents() {
    const components = this.props.minimizedComponents.
      map((componentName) => (
        <div
          key={componentName}
          className="sidebar-minimizedComponent"
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
          <WordmarkVertical className="sidebar-wordmark"/>
          <div className="sidebar-showArrow"/>
        </div>
        {this._renderMinimizedComponents()}
      </div>
    );
  }
}

Sidebar.propTypes = {
  minimizedComponents: React.PropTypes.array.isRequired,
  onComponentMaximized: React.PropTypes.func.isRequired,
};

export default Sidebar;
