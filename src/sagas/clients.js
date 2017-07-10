import {all, call, put, select, takeEvery} from 'redux-saga/effects';
import {createFromProject} from '../clients/gists';
import {gistExported, gistExportError} from '../actions/clients';
import {getCurrentProject} from '../selectors';

export function* exportGist() {
  const state = yield select();
  const project = getCurrentProject(state);
  const user = state.get('user').toJS();
  try {
    const {html_url} = yield call(createFromProject, project, user);
    yield put(gistExported(html_url));
  } catch (e) {
    yield put(gistExportError(e));
  }
}

export default function* () {
  yield all([takeEvery('EXPORT_GIST', exportGist)]);
}
