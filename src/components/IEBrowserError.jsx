import i18next from 'i18next';
import React from 'react';

function IEBrowserError() {
  return (
    <div className="unsupported-browser">
      <p>{i18next.t('bad-browser.ie-message')}</p>
    </div>
  );
}

export default IEBrowserError;
