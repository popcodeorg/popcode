import {initialize, pageview} from 'react-ga';

import config from '../config';

const cookieDomain =
  (window.location.hostname === 'localhost') ?
    'none' :
    window.location.hostname;

export function init() {
  initialize(
    config.googleAnalyticsTrackingId,
    {gaOptions: {cookieDomain}},
  );
}

export function logPageview() {
  pageview(window.location.pathname);
}
