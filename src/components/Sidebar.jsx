import React from 'react';
import PropTypes from 'prop-types';
import {t} from 'i18next';
import classnames from 'classnames';
import partial from 'lodash/partial';
import WordmarkVertical from '../../static/images/wordmark-vertical.svg';

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
        sidebar_red: this.props.validationState === 'failed',
      },
    );

    return (
      <div className={sidebarClassnames}>
        <div className="sidebar__wordmark-container">
          <WordmarkVertical />
        </div>
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
        <div className="sidebar__change-textSize">
          <div onClick={this.props.onIncrementTextSize}> &#xf067; </div>
          <div onClick={this.props.onDecrementTextSize}> &#xf068; </div>
        </div>
        {this._renderHiddenComponents()}
      </div>
    );
  }
}

Sidebar.propTypes = {
  dashboardIsOpen: PropTypes.bool.isRequired,
  hiddenComponents: PropTypes.array.isRequired,
  validationState: PropTypes.string.isRequired,
  onComponentUnhide: PropTypes.func.isRequired,
  onDecrementTextSize: PropTypes.func.isRequired,
  onIncrementTextSize: PropTypes.func.isRequired,
  onToggleDashboard: PropTypes.func.isRequired,
};

export default Sidebar;
