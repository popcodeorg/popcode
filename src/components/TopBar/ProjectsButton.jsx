import classnames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import {t} from 'i18next';
import ProjectList from './ProjectList';

export default function ProjectsButton({
  isOpen,
  projectKeys,
  onClick,
}) {
  if (projectKeys.length < 2) {
    return null;
  }

  return (
    <div
      className={classnames(
        'top-bar__menu-button',
        {'top-bar__menu-button_active': isOpen},
      )}
      onClick={onClick}
    >
      {t('top-bar.load-project')}
      {' '}
      <span className="u__icon">
        &#xf0d7;
      </span>
      <ProjectList
        isOpen={isOpen}
        projectKeys={projectKeys}
      />
    </div>
  );
}

ProjectsButton.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  projectKeys: PropTypes.arrayOf(PropTypes.string).isRequired,
  onClick: PropTypes.func.isRequired,
};
