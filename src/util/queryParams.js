import qs from 'qs';

export function getQueryParameters(queryString) {
  let gistId = null;
  let snapshotKey = null;
  let isExperimental = false;
  let assignmentKey = null;
  if (queryString) {
    const query = qs.parse(queryString.slice(1));
    if (query.gist) {
      gistId = query.gist;
    }
    if (query.snapshot) {
      snapshotKey = query.snapshot;
    }
    if (query.assignment) {
      assignmentKey = query.assignment;
    }
    isExperimental = Object.keys(query).includes('experimental');
  }
  return {
    gistId,
    snapshotKey,
    isExperimental,
    assignmentKey,
  };
}

export function setQueryParameters(params) {
  if (params.isExperimental) {
    history.replaceState({}, '', '?experimental');
  } else {
    history.replaceState({}, '', location.pathname);
  }
}
