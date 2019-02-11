import ReactGA from 'react-ga';

import config from '../config';

const cookieDomain =
  (window.location.hostname === 'localhost') ?
    'none' :
    window.location.hostname;

export function init() {
  ReactGA.initialize(
    config.googleAnalyticsTrackingId,
    {gaOptions: {cookieDomain}},
  );
}

export function logPageview() {
  ReactGA.pageview(window.location.pathname);
}
