import {t} from 'i18next';
import React from 'react';
import PropTypes from 'prop-types';

export default function NewProjectButton({isUserConfirmed, onClick}) {
  if (!isUserConfirmed) {
    return false;
  }

  return (
    <div
      className="top-bar__menu-button"
      onClick={onClick}
    >
      {t('top-bar.new-project')}
    </div>
  );
}

NewProjectButton.propTypes = {
  isUserConfirmed: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};
