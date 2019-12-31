import qs from 'qs';

export function getQueryParameters(queryString) {
  let gistId = null;
  let snapshotKey = null;
  let isExperimental = false;
  let remoteConfig = {};
  if (queryString) {
    const query = qs.parse(queryString.slice(1), {allowDots: true});
    if (query.gist) {
      gistId = query.gist;
    }
    if (query.snapshot) {
      snapshotKey = query.snapshot;
    }
    isExperimental = Object.keys(query).includes('experimental');
    if (query.rco) {
      remoteConfig = query.rco;
    }
  }
  return {
    gistId,
    snapshotKey,
    isExperimental,
    remoteConfig,
  };
}

export function setQueryParameters(params) {
  if (params.isExperimental) {
    history.replaceState({}, '', '?experimental');
  } else {
    history.replaceState({}, '', location.pathname);
  }
}
