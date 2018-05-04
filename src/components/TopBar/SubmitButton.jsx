import classnames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import {t} from 'i18next';

export default function SubmitButton({onClick}) {
  return (
    <div
      className={classnames(
        'top-bar__menu-button',
        'top-bar__menu-button_submit',
        // {'top-bar__snapshot_in-progress': isInProgress},
      )}
      onClick={onClick}
    >
      {t('top-bar.submit-assignment')}
    </div>
  );
}

SubmitButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};
