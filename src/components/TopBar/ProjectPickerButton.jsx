import classnames from 'classnames';
import React from 'react';
import i18next from 'i18next';
import PropTypes from 'prop-types';
import {isEmpty} from 'lodash-es';

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
        <FontAwesomeIcon
          className="top-bar__drop-down-button"
          icon={faCaretDown}
        />
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
