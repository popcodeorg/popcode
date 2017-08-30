import classnames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import {t} from 'i18next';
import LibraryPicker from './LibraryPicker';

export default function LibraryPickerButton({
  enabledLibraries,
  isOpen,
  onClick,
  onLibraryToggled,
}) {
  return (
    <div
      className={classnames(
        'top-bar__menu-button',
        {'top-bar__menu-button_active': isOpen},
      )}
      onClick={onClick}
    >
      {t('top-bar.libraries')}
      {' '}
      <span className="u__icon">
        &#xf0d7;
      </span>
      <LibraryPicker
        enabledLibraries={enabledLibraries}
        isOpen={isOpen}
        onLibraryToggled={onLibraryToggled}
      />
    </div>
  );
}

LibraryPickerButton.propTypes = {
  enabledLibraries: PropTypes.arrayOf(PropTypes.string).isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  onLibraryToggled: PropTypes.func.isRequired,
};
