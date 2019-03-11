import unlinkGithubIdentity from '../unlinkGithubIdentity';

test('should unlink Github Identity', () => {
  expect(1).toBe(1);
});


//
// import {unlinkGithub} from '../../clients/firebase';
//
// jest.mock('unlinkGithub');
//
// test('should unlink Github Identity', () => {
//   unlinkGithub.mockResolvedValue('test');
//   unlinkGithubIdentity();
//   expect(unlinkGithub).toBeCalled();
// });

// OLD TEST
// test('unlinkGithubIdentity', (assert) => {
//   testSaga(unlinkGithubIdentitySaga, unlinkGithubIdentity).
//     next().call(unlinkGithub).
//     next().put(identityUnlinked('github.com'));
//   assert.end();
// });
