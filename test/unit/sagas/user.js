import test from 'tape';
import {testSaga} from 'redux-saga-test-plan';
import applicationLoaded from '../../../src/actions/applicationLoaded';
import {userAuthenticated} from '../../../src/actions/user';
import {
  applicationLoaded as applicationLoadedSaga,
} from '../../../src/sagas/user';
import {getInitialUserState} from '../../../src/clients/firebase';
import {userCredential as createUserCredential} from '../../helpers/factory';

test('applicationLoaded', (t) => {
  t.test('with no logged in user', (assert) => {
    testSaga(applicationLoadedSaga, applicationLoaded({})).
      next().call(getInitialUserState).
      next(null).isDone();

    assert.end();
  });

  t.test('with logged in user', (assert) => {
    const userCredential = createUserCredential();
    testSaga(applicationLoadedSaga, applicationLoaded({})).
      next().call(getInitialUserState).
      next(userCredential).put(userAuthenticated(userCredential)).
      next().isDone();

    assert.end();
  });
});
