import {call, put, select, takeEvery} from 'redux-saga/effects';
import Gists from '../clients/Gists';
import {gistExported, gistExportError} from '../actions/clients';
import {getCurrentProject} from '../util/projectUtils';

export function* exportGist() {
  const state = yield select();
  const project = getCurrentProject(state);
  const user = state.get('user').toJS();
  try {
    const {html_url} = yield call(Gists.createFromProject, project, user);
    yield put(gistExported(html_url));
  } catch (e) {
    yield put(gistExportError(e));
  }
}

export default function* () {
  yield [
    takeEvery('EXPORT_GIST', exportGist),
  ];
}
