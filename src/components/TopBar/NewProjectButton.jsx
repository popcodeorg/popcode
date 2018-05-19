import {t} from 'i18next';
import React from 'react';
import PropTypes from 'prop-types';

export default function NewProjectButton({
  onClick,
  isUserAuthenticated,
}) {
  if (!isUserAuthenticated) {
    return false;
  }

  return (
    <div
      className="top-bar__menu-button top-bar__menu-button_secondary"
      onClick={onClick}
    >
      {t('top-bar.new-project')}
    </div>
  );
}

NewProjectButton.propTypes = {
  isUserAuthenticated: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};
