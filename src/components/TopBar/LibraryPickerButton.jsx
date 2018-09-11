import {library} from '@fortawesome/fontawesome-svg-core';
import {faCaretDown} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import React from 'react';
import {t} from 'i18next';

library.add(faCaretDown);

export default function LibraryPickerButton() {
  return (
    <span>
      {t('top-bar.libraries')}
      <FontAwesomeIcon
        className="top-bar__drop-down-button"
        icon="caret-down"
      />
    </span>
  );
}

LibraryPickerButton.propTypes = {};
