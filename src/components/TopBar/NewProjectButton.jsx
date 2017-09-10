import {t} from 'i18next';
import React from 'react';
import PropTypes from 'prop-types';

<<<<<<< HEAD
export default function NewProjectButton({
  onClick,
  isUserAuthenticated,
}) {
=======
export default function NewProjectButton({isUserAuthenticated, onClick}) {
>>>>>>> fa1acd3... Element Highlighter
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
