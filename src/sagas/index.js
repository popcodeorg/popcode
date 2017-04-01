import watchErrors from './errors';
import watchProjects from './projects';
import watchUser from './user';

export default function* rootSaga() {
  yield [
    watchErrors(),
    watchProjects(),
    watchUser(),
  ];
}
