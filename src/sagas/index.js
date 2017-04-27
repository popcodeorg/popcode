import watchErrors from './errors';
import watchProjects from './projects';
import watchUi from './ui';
import watchUser from './user';
import watchClients from './clients';

export default function* rootSaga() {
  yield [
    watchErrors(),
    watchProjects(),
    watchUi(),
    watchUser(),
    watchClients(),
  ];
}
