import {all} from 'redux-saga/effects';

import manageUserState from './manageUserState';
import watchProjects from './projects';
import watchUi from './ui';
import watchClients from './clients';
import watchCompiledProjects from './compiledProjects';

export default function* rootSaga() {
  yield all([
    manageUserState(),
    watchProjects(),
    watchUi(),
    watchClients(),
    watchCompiledProjects(),
  ]);
}
