import React from 'react';
import PropTypes from 'prop-types';
import {t} from 'i18next';
import classnames from 'classnames';
import partial from 'lodash/partial';

class Sidebar extends React.Component {
  _renderHiddenComponents() {
    const components = this.props.hiddenComponents.
      map(componentName => (
        <div
          className="sidebar__minimized-component"
          key={componentName}
          onClick={partial(this.props.onComponentUnhide, componentName)}
        >
          {t(`workspace.components.${componentName}`)}
        </div>
      ));

    return (
      <div className="sidebar__minimized-components">
        {components}
      </div>
    );
  }

  render() {
    const sidebarClassnames = classnames(
      'sidebar',
      {
        sidebar_yellow: this.props.validationState === 'validating',
        sidebar_red: this.props.validationState === 'validation-error' ||
          this.props.validationState === 'runtime-error',
      },
    );

    return (
      <div className={sidebarClassnames}>
        <div
          className={classnames(
            'sidebar__arrow',
            {
              sidebar__arrow_show: !this.props.dashboardIsOpen,
              sidebar__arrow_hide: this.props.dashboardIsOpen,
            },
          )}
          onClick={this.props.onToggleDashboard}
        />
        <div
          className="sidebar__plusMinus"
          onClick={this.props.onToggleEditorTextSize}
        >
          {
            this.props.textSizeIsLarge ?
              <icon className="u__icon">&#xf010;</icon> :
              <icon className="u__icon">&#xf00e;</icon>
          }
        </div>
        {this._renderHiddenComponents()}
      </div>
    );
  }
}

Sidebar.propTypes = {
  dashboardIsOpen: PropTypes.bool.isRequired,
  hiddenComponents: PropTypes.array.isRequired,
  textSizeIsLarge: PropTypes.bool.isRequired,
  validationState: PropTypes.string.isRequired,
  onComponentUnhide: PropTypes.func.isRequired,
  onToggleDashboard: PropTypes.func.isRequired,
  onToggleEditorTextSize: PropTypes.func.isRequired,
};

export default Sidebar;
