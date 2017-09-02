import React from 'react';
import {t} from 'i18next';

export default function LibraryPickerButton() {
  return (
    <span>
      {t('top-bar.libraries')}
      {' '}
      <span className="u__icon">
        &#xf0d7;
      </span>
    </span>
  );
}

LibraryPickerButton.propTypes = {};
