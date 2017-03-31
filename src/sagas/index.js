import watchProjects from './projects';
import watchErrors from './errors';

export default function* rootSaga() {
  yield [
    watchProjects(),
    watchErrors(),
  ];
}
