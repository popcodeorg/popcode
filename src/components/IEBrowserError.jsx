import React from 'react';
import {t} from 'i18next';

function IEBrowserError() {
  return (
    <div className="unsupported-browser">
      <p>{t('bad-browser.ie-message')}</p>
    </div>
  );
}

export default IEBrowserError;
