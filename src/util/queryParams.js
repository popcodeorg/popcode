import qs from 'qs';

export function getQueryParameters(queryString) {
  let gistId = null;
  let snapshotKey = null;
  let isExperimental = false;
  if (queryString) {
    const query = qs.parse(queryString.slice(1));
    if (query.gist) {
      gistId = query.gist;
    }
    if (query.snapshot) {
      snapshotKey = query.snapshot;
    }
    isExperimental = Object.keys(query).includes('experimental');
  }
  return {
    gistId,
    snapshotKey,
    isExperimental,
  };
}

export function setQueryParameters(params) {
  if (params.isExperimental) {
    history.replaceState({}, '', '?experimental');
  } else {
    history.replaceState({}, '', location.pathname);
  }
}
