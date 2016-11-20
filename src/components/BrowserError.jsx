import React from 'react';
import i18n from 'i18next-client';

function getBrowserLink(browser) {
  if (browser.firefox) {
    return 'https://www.mozilla.org/en-US/firefox/new/';
  }
  if (browser.safari) {
    return 'https://support.apple.com/downloads/safari';
  }
  return 'https://www.google.com/chrome/browser/desktop/';
}

function BrowserError(props) {
  const browserName = props.browser.name;

  return (
    <div className="unsupported-browser">
      <p>{i18n.t('bad-browser.message', {name: browserName})}</p>

      <p>
        <a href={getBrowserLink(props.browser)}>
          {i18n.t('bad-browser.download')}
        </a>
      </p>
    </div>
  );
}

BrowserError.propTypes = {
  browser: React.PropTypes.object.isRequired,
};

export default BrowserError;
