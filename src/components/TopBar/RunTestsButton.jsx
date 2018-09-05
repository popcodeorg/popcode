import classnames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
// import {t} from 'i18next';

export default function RunTestsButton({hasTests, onClick}) {
  if (!hasTests) {
    return null;
  }
  return (
    <div
      className={classnames(
        'top-bar__menu-button',
        'top-bar__menu-button_primary',
      )}
      onClick={onClick}
    >
      Run Tests
    </div>
  );
}

RunTestsButton.propTypes = {
  hasTests: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};
