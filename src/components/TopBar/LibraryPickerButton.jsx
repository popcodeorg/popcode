import React from 'react';
import {t} from 'i18next';

export default function LibraryPickerButton() {
  return (
    <span>
      {t('top-bar.libraries')}
      {' '}
      <span className="top-bar__drop-down-button u__icon">
        &#xf078;
      </span>
    </span>
  );
}

LibraryPickerButton.propTypes = {};
