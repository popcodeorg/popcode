import React from 'react';
import PropTypes from 'prop-types';
import remark from 'remark';
import remarkReact from 'remark-react';
import classnames from 'classnames';

function Dashboard({instructions, isOpen}) {
  if (!isOpen) {
    return null;
  }

  const sidebarClassnames = classnames(
    'layout__dashboard',
    'dashboard',
    'u__flex-container',
    'u__flex-container_column',
  );

  return (
    <div className={sidebarClassnames}>
      <div className="dashboard__instructions">
        {remark().use(remarkReact).processSync(instructions).contents}
      </div>
    </div>
  );
}

Dashboard.propTypes = {
  instructions: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
};

export default Dashboard;
