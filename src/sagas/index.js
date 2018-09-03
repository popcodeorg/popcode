import {all} from 'redux-saga/effects';
import watchErrors from './errors';
import watchProjects from './projects';
import watchUi from './ui';
import watchUser from './user';
import watchClients from './clients';
import watchCompiledProjects from './compiledProjects';
import watchTests from './tests';

export default function* rootSaga() {
  yield all([
    watchErrors(),
    watchProjects(),
    watchUi(),
    watchUser(),
    watchClients(),
    watchCompiledProjects(),
    watchTests(),
  ]);
}
