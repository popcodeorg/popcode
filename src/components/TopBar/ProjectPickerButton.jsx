import classnames from 'classnames';
import i18next from 'i18next';
import isEmpty from 'lodash-es/isEmpty';
import PropTypes from 'prop-types';
import React from 'react';

export default function ProjectPickerButton({
  currentProjectKey,
  isUserAuthenticated,
  projectKeys,
  shouldShowSavedIndicator,
  onClick,
}) {
  if (
    !(
      isUserAuthenticated &&
      !isEmpty(projectKeys) &&
      Boolean(currentProjectKey)
    )
  ) {
    return null;
  }

  return (
    <div className="top-bar__menu-button" onClick={onClick}>
      <span className={classnames({u__invisible: shouldShowSavedIndicator})}>
        {i18next.t('top-bar.load-project')}
      </span>
      <span
        className={classnames('top-bar__project-saved', {
          u__invisible: !shouldShowSavedIndicator,
        })}
      >
        {i18next.t('top-bar.project-saved')}
      </span>
    </div>
  );
}

ProjectPickerButton.propTypes = {
  currentProjectKey: PropTypes.string,
  isUserAuthenticated: PropTypes.bool.isRequired,
  projectKeys: PropTypes.array.isRequired,
  shouldShowSavedIndicator: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

ProjectPickerButton.defaultProps = {
  currentProjectKey: null,
};
