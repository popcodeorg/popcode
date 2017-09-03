import React from 'react';
import {t} from 'i18next';

export default function ProjectPickerButton() {
  return (
    <span>
      {t('top-bar.load-project')}
      {' '}
      <span className="u__icon">
        &#xf0d7;
      </span>
    </span>
  );
}

ProjectPickerButton.propTypes = {};
