import watchErrors from './errors';
import watchProjects from './projects';
import watchUi from './ui';
import watchUser from './user';

export default function* rootSaga() {
  yield [
    watchErrors(),
    watchProjects(),
    watchUi(),
    watchUser(),
  ];
}
