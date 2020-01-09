import {mixpanelToken} from '../config';

export async function loadMixpanel() {
  const {default: mixpanel} = await import(
    /* webpackChunkName: "mainAsync" */
    'mixpanel-browser'
  );
  return mixpanel;
}
export async function initMixpanel() {
  const mixpanel = await loadMixpanel();
  mixpanel.init(mixpanelToken);
}
