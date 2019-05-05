import {all} from 'redux-saga/effects';

import manageUserState from './manageUserState';
import watchErrors from './errors';
import watchProjects from './projects';
import watchUi from './ui';
import watchUser from './user';
import watchClients from './clients';
import watchCompiledProjects from './compiledProjects';
import watchAssignments from './assignments';

export default function* rootSaga() {
  yield all([
    manageUserState(),
    watchErrors(),
    watchProjects(),
    watchUi(),
    watchUser(),
    watchClients(),
    watchCompiledProjects(),
    watchAssignments(),
  ]);
}
