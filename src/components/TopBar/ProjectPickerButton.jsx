import classnames from 'classnames';
import React from 'react';
import {t} from 'i18next';
import PropTypes from 'prop-types';

export default function ProjectPickerButton({shouldShowSavedIndicator}) {
  return (
    <div>
      <span
        className={
          classnames(
            {u__invisible: shouldShowSavedIndicator},
          )
        }
      >
        {t('top-bar.load-project')}
        {' '}
        <span className="u__icon top-bar__drop-down-button">
          &#xf0d7;
        </span>
      </span>
      <span
        className={
          classnames(
            'top-bar__project-saved',
            {u__invisible: !shouldShowSavedIndicator})
        }
      >
        {t('top-bar.project-saved')}
      </span>
    </div>
  );
}

ProjectPickerButton.propTypes = {
  shouldShowSavedIndicator: PropTypes.bool.isRequired,
};
