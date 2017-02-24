import watchProjects from './projects';

export default function* rootSaga() {
  yield [
    watchProjects(),
  ];
}
