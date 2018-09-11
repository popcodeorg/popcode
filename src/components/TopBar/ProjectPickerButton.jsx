import classnames from 'classnames';
import {library} from '@fortawesome/fontawesome-svg-core';
import {faCaretDown} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import React from 'react';
import {t} from 'i18next';
import PropTypes from 'prop-types';

library.add(faCaretDown);

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
        <FontAwesomeIcon
          className="top-bar__drop-down-button"
          icon="caret-down"
        />
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
