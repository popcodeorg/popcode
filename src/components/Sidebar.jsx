import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

function Sidebar({dashboardIsOpen, onToggleDashboard}) {
  return (
    <div className="sidebar">
      <div
        className={classnames(
          'sidebar__arrow',
          {
            sidebar__arrow_show: !dashboardIsOpen,
            sidebar__arrow_hide: dashboardIsOpen,
          },
        )}
        onClick={onToggleDashboard}
      />
    </div>
  );
}

Sidebar.propTypes = {
  dashboardIsOpen: PropTypes.bool.isRequired,
  onToggleDashboard: PropTypes.func.isRequired,
};

export default Sidebar;
