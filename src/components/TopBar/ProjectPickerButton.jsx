import {faCaretDown} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import classnames from 'classnames';
import i18next from 'i18next';
import PropTypes from 'prop-types';
import React from 'react';

export default function ProjectPickerButton({shouldShowSavedIndicator}) {
  return (
    <div>
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
  shouldShowSavedIndicator: PropTypes.bool.isRequired,
};
