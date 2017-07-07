import React from 'react';
import PropTypes from 'prop-types';
import {t} from 'i18next';
import classnames from 'classnames';
import partial from 'lodash/partial';
import WordmarkVertical from '../static/images/wordmark-vertical.svg';

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

    let plusMinus;
    if (this.props.textSizeIsLarge) {
      plusMinus = <span className="sidebar__plusMinus">&#xf010;</span>;
    } else {
      plusMinus = <span className="sidebar__plusMinus">&#xf00e;</span>;
    }

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
        <div
          className="sidebar__component"
          onClick={this.props.onToggleEditorTextSize}
        >
          {plusMinus}
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
